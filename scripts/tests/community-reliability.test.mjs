/* Offline compatible community tests; no hosted policies or database writes are exercised. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
const root = fileURLToPath(new URL('../../', import.meta.url));
const req = createRequire(import.meta.url);
const ID = 'f4d22709-b693-4c01-a385-72b24bcb977a';
const SUB = '017b3f16-67ea-4a40-8178-9740e988a1bc';
const target = 'item:guide';
const route = '/item/guide';
function harness({ configured = true, owner = false, admin = true, auth, handler } = {}) {
  const calls = [], refreshed = [], deadlines = [], cache = new Map();
  let authReads = 0, adminCreates = 0;
  const user = { id: ID, email: 'player@example.test', user_metadata: { full_name: 'Player One', avatar_url: 'https://example.test/avatar.png' } };
  function query(table, rpc = false) {
    const call = { table, rpc, ops: [], signal: null };
    const q = {
      abortSignal(signal) { call.signal = signal; return q; },
      then(resolve, reject) {
        calls.push(call);
        return Promise.resolve().then(() => handler ? handler(call) : defaultResult(call)).then(resolve, reject);
      },
    };
    for (const op of ['select', 'eq', 'order', 'limit', 'in', 'gte', 'maybeSingle', 'insert', 'update', 'delete', 'upsert']) q[op] = (...args) => { call.ops.push([op, ...args]); return q; };
    return q;
  }
  function defaultResult(call) {
    if (call.ops.some(o => o[0] === 'update')) return { data: { id: ID, target }, error: null };
    if (call.ops.some(o => o[0] === 'select' && o[2]?.head)) return { count: 0, data: null, error: null };
    if (call.ops.some(o => o[0] === 'maybeSingle')) return { data: { id: SUB, slug: 'guide' }, error: null };
    return { data: [], error: null };
  }
  const client = {
    from: table => query(table), rpc: (name, args) => { const q = query(name, true); q.select(args); return q; },
    auth: { getUser: async () => { authReads++; return auth ? auth() : { data: { user }, error: null }; } },
  };
  function load(file) {
    if (cache.has(file)) return cache.get(file);
    const js = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
    const context = { exports: {}, require: name => {
      if (name === 'server-only') return {};
      if (name === '@/lib/supabase/server') return { supabaseConfigured: () => configured, createClient: async () => client };
      if (name === '@/lib/admin') return { adminConfigured: () => admin, isOwner: () => owner, adminClient: () => { adminCreates++; return client; } };
      if (name === 'next/cache') return { revalidatePath: p => refreshed.push(p) };
      if (name.startsWith('.') || name.startsWith('@/')) {
        const stem = name.startsWith('@/') ? 'src/' + name.slice(2) : path.join(path.dirname(file), name);
        const found = ['.ts', '.tsx', ''].map(ext => stem + ext).find(f => fs.existsSync(path.join(root, f)));
        assert(found, 'Missing local module: ' + stem); return load(found);
      }
      return req(name);
    }, URL, FormData, AbortSignal: { timeout(ms) { const c = new AbortController(); deadlines.push({ ms, c }); return c.signal; } } };
    vm.runInNewContext(js, context, { filename: file }); cache.set(file, context.exports); return context.exports;
  }
  return { calls, refreshed, deadlines, load, user, defaultResult, authReads: () => authReads, adminCreates: () => adminCreates };
}
function form(values = {}) {
  const f = new FormData();
  for (const [key, value] of Object.entries({ title: 'Useful discovery', body: 'Useful player discovery with enough detail.', category: 'tips', place: '', video: '', ...values })) f.set(key, value);
  return f;
}
const wrote = h => h.calls.filter(c => c.ops.some(o => ['insert', 'update', 'delete', 'upsert'].includes(o[0])));
const rejected = async (p, error) => { const result = await p; assert.equal(result.ok, false); assert.equal(result.error, error); };
const flush = async () => { for (let n = 0; n < 20; n++) await Promise.resolve(); };
let passed = 0;
async function check(name, fn) { await fn(); passed++; console.log('PASS ' + name); }
await check('runtime vote values, targets and refresh paths are validated before auth or storage', async () => {
  const h = harness(), a = h.load('src/lib/community/actions.ts');
  for (const value of [2, '1', null, {}, NaN]) await rejected(a.vote(target, value, route), 'invalid');
  for (const value of [null, {}, 'sub:not-a-uuid', 'item:../../admin', 'item:' + 'a'.repeat(252)]) await rejected(a.vote(value, 1, route), 'invalid');
  for (const p of ['/admin', '/', '//outside.test', 'https://outside.test', '/item/[slug]', route + '?secret=x']) await rejected(a.vote(target, 1, p), 'invalid');
  assert.equal(h.authReads(), 0); assert.equal(h.calls.length, 0); assert.equal(h.refreshed.length, 0);
});
await check('fresh authentication is required and outages are distinct from signed-out sessions', async () => {
  for (const [auth, expected] of [
    [() => ({ data: { user: null }, error: null }), 'auth'],
    [() => ({ data: { user: null }, error: { name: 'AuthSessionMissingError' } }), 'auth'],
    [() => ({ data: { user: null }, error: { status: 503 } }), 'unavailable'],
    [() => { throw new Error('private transport detail'); }, 'unavailable'],
  ]) {
    const h = harness({ auth }); await rejected(h.load('src/lib/community/actions.ts').vote(target, 1, route), expected); assert.equal(wrote(h).length, 0);
  }
  const offline = harness({ configured: false }); await rejected(offline.load('src/lib/community/actions.ts').vote(target, 1, route), 'offline'); assert.equal(offline.authReads(), 0);
});
await check('missing targets cannot receive writes, and lookup failure is not missing content', async () => {
  for (const error of [null, { message: 'database down' }]) {
    const h = harness({ handler: () => ({ data: null, error }) }); await rejected(h.load('src/lib/community/actions.ts').vote(target, 1, route), error ? 'unavailable' : 'invalid'); assert.equal(wrote(h).length, 0);
  }
});
await check('vote insert and removal check errors without reporting success or revalidating', async () => {
  for (const value of [-1, 0, 1]) {
    let h; h = harness({ handler: c => c.table === 'votes' ? { data: null, error: { code: '42501', message: 'private failure' } } : h.defaultResult(c) });
    await rejected(h.load('src/lib/community/actions.ts').vote(target, value, route), 'unavailable'); assert.equal(h.refreshed.length, 0);
  }
});
await check('successful votes derive only target and community refresh paths', async () => {
  const h = harness(), a = h.load('src/lib/community/actions.ts'); assert.equal((await a.vote('sub:' + SUB, 1, '/community')).ok, true);
  assert.deepEqual(h.refreshed, ['/community/' + SUB, '/community']);
  const payload = wrote(h)[0].ops.find(o => o[0] === 'upsert')[1]; assert.equal(payload.user_id, ID); assert.equal(payload.value, 1);
});
await check('editable auth metadata cannot crash string methods or store unsafe avatars', async () => {
  const h = harness(); h.user.user_metadata = { full_name: { x: 'unsafe' }, name: ['unsafe'], avatar_url: 'javascript:alert(1)' };
  assert.equal((await h.load('src/lib/community/actions.ts').addComment(target, 'Valid comment', route)).ok, true);
  const row = wrote(h)[0].ops.find(o => o[0] === 'insert')[1]; assert.equal(row.author_name, 'Player'); assert.equal(row.author_avatar, null); assert.equal(row.user_id, ID);
});
await check('comment runtime types, lengths and links fail without mutation', async () => {
  const h = harness(), a = h.load('src/lib/community/actions.ts');
  for (const text of [null, {}, 'x', 'a'.repeat(1501), 'Visit https://spam.test', 'Visit www.spam.test']) await rejected(a.addComment(target, text, route), 'invalid');
  assert.equal(h.authReads(), 0); assert.equal(wrote(h).length, 0);
});
await check('failed or missing quota counts fail closed and daily limits remain enforced', async () => {
  for (const count of [null, NaN, -1, 40]) {
    let h; h = harness({ handler: c => c.ops.some(o => o[0] === 'select' && o[2]?.head) ? { count, data: null, error: null } : h.defaultResult(c) });
    await rejected(h.load('src/lib/community/actions.ts').addComment(target, 'Valid comment', route), count === 40 ? 'limit' : 'unavailable'); assert.equal(wrote(h).length, 0);
  }
  let h; h = harness({ handler: c => c.ops.some(o => o[0] === 'select' && o[2]?.head) ? { count: 0, error: { message: 'down' } } : h.defaultResult(c) });
  await rejected(h.load('src/lib/community/actions.ts').submitDiscovery(form()), 'unavailable'); assert.equal(wrote(h).length, 0);
});
await check('submission form types, media hosts, credentials and oversized input are rejected', async () => {
  const h = harness(), a = h.load('src/lib/community/actions.ts');
  await rejected(a.submitDiscovery({ get: () => 'fake' }), 'invalid');
  for (const video of ['javascript:alert(1)', 'https://youtube.com.evil.test/x', 'https://user:pass@youtube.com/watch?v=a', 'http://youtu.be/a', 'https://youtu.be/a\n', 'https://youtu.be/' + 'a'.repeat(300)]) {
    // Form strings are trimmed first; an internal control character remains invalid.
    await rejected(a.submitDiscovery(form({ video: video.endsWith('\n') ? 'https://youtu.be/a\nb' : video })), 'invalid');
  }
  await rejected(a.submitDiscovery(form({ title: 'tiny' })), 'invalid');
  await rejected(a.submitDiscovery(form({ place: 'x'.repeat(121) })), 'invalid');
  const f = form(); f.set('title', new Blob(['not a text field'])); await rejected(a.submitDiscovery(f), 'invalid');
  assert.equal(wrote(h).length, 0); assert.equal(h.authReads(), 0);
});
await check('valid discovery preserves bounded fields and maps known DB guards without leaking errors', async () => {
  const h = harness(); assert.equal((await h.load('src/lib/community/actions.ts').submitDiscovery(form({ video: 'https://youtu.be/dQw4w9WgXcQ' }))).ok, true);
  assert.equal(wrote(h)[0].ops.find(o => o[0] === 'insert')[1].video_url, 'https://youtu.be/dQw4w9WgXcQ');
  for (const [error, expected] of [[{ code: 'P0001', message: 'community_limit' }, 'limit'], [{ code: '22023', message: 'private detail' }, 'invalid'], [{ code: '28000' }, 'auth'], [{ code: '08006', message: 'private detail' }, 'unavailable']]) {
    let x; x = harness({ handler: c => c.ops.some(o => o[0] === 'insert') ? { error } : x.defaultResult(c) });
    await rejected(x.load('src/lib/community/actions.ts').submitDiscovery(form()), expected); assert.equal(x.refreshed.length, 0);
  }
});
await check('moderation rejects forged kind/id and non-owner before service-role construction', async () => {
  const h = harness({ owner: true }), a = h.load('src/lib/community/actions.ts');
  await rejected(a.hideContent('votes', ID), 'invalid'); await rejected(a.hideContent('comment', 'a'.repeat(36)), 'invalid'); assert.equal(h.adminCreates(), 0);
  const guest = harness(); await rejected(guest.load('src/lib/community/actions.ts').hideContent('comment', ID), 'auth'); assert.equal(guest.adminCreates(), 0);
});
await check('moderation must affect a row and refreshes its actual content path only after success', async () => {
  for (const error of [null, { code: '42501' }]) {
    let h; h = harness({ owner: true, handler: c => c.ops.some(o => o[0] === 'update') ? { data: null, error } : h.defaultResult(c) });
    await rejected(h.load('src/lib/community/actions.ts').hideContent('comment', ID), error ? 'unavailable' : 'invalid'); assert.equal(h.refreshed.length, 0);
  }
  const h = harness({ owner: true }); assert.equal((await h.load('src/lib/community/actions.ts').hideContent('comment', ID)).ok, true); assert(h.refreshed.includes(route)); assert(h.refreshed.includes('/admin'));
});
await check('community read failures cannot become fake empty comments, submissions or vote totals', async () => {
  const h = harness({ handler: () => ({ data: null, error: { message: 'down' } }) }), d = h.load('src/lib/community/data.ts');
  for (const p of [d.getComments(target), d.getSubmissions(), d.getVotes([target], ID)]) await assert.rejects(p, e => e.name === 'PublicReadError');
});
await check('latest bounded comments remain chronological and own/totals share one deadline', async () => {
  const h = harness({ handler: c => c.table === 'comments' ? { data: [{ id: 'new' }, { id: 'old' }], error: null } : { data: [], error: null } }), d = h.load('src/lib/community/data.ts');
  assert.deepEqual(Array.from(await d.getComments(target), x => x.id), ['old', 'new']);
  assert(h.calls[0].ops.some(o => o[0] === 'order' && o[1] === 'created_at' && o[2].ascending === false));
  await d.getVotes([target], ID); assert.equal(h.calls[1].signal, h.calls[2].signal);
});
await check('stalled community reads are bounded even if transport ignores cancellation', async () => {
  const h = harness({ handler: () => new Promise(() => {}) }); const pending = h.load('src/lib/community/data.ts').getVotes([target], ID); await flush();
  assert.equal(h.deadlines.length, 1); const failure = assert.rejects(pending, e => e.name === 'PublicReadError'); h.deadlines[0].c.abort(); await failure;
});
function uiHarness(file, exported, props, outcome, pendingState = false) {
  const state = [], pending = [], pushes = [];
  let cursor = 0, resets = 0, tree;
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const setter = initial => { const i = cursor++; if (!(i in state)) state[i] = initial; return [state[i], value => { state[i] = typeof value === 'function' ? value(state[i]) : value; }]; };
  const invoke = async () => { if (outcome instanceof Error) throw outcome; return outcome; };
  const feedback = harness().load('src/lib/community/feedback.ts');
  class SubmittedData extends FormData { constructor() { super(); } }
  const modules = {
    react: { useState: setter, useOptimistic: setter, useTransition: () => [pendingState, fn => { pending.push(Promise.resolve().then(fn)); }], useRef: () => ({ current: { reset: () => resets++ } }) },
    'react/jsx-runtime': { jsx: (type, p) => ({ type, props: p }), jsxs: (type, p) => ({ type, props: p }) },
    'next/navigation': { useRouter: () => ({ push: p => pushes.push(p) }) },
    'next/link': 'Link', 'lucide-react': {}, '@/lib/community/feedback': feedback,
    '@/lib/community/actions': { vote: invoke, hideContent: invoke, addComment: invoke, submitDiscovery: invoke },
  };
  const context = { exports: {}, FormData: SubmittedData, require: name => { assert(name in modules, name); return modules[name]; } };
  vm.runInNewContext(ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText, context, { filename: file });
  function nodes(value, predicate, result = []) {
    if (Array.isArray(value)) for (const child of value) nodes(child, predicate, result);
    else if (value && typeof value === 'object') { if (predicate(value)) result.push(value); nodes(value.props?.children, predicate, result); }
    return result;
  }
  const render = () => { cursor = 0; tree = context.exports[exported](props); return tree; };
  render();
  return { state, pushes, render, queued: () => pending.length, resets: () => resets, nodes: predicate => nodes(tree, predicate), settle: async () => { await Promise.all(pending.splice(0)); render(); } };
}
await check('failed or interrupted votes restore prior counts and expose localized feedback', async () => {
  for (const ar of [true, false]) for (const outcome of [{ ok: false, error: 'unavailable' }, new Error('network')]) {
    const h = uiHarness('src/components/community/VoteBar.tsx', 'VoteBar', { target, path: route, ar, votes: { up: 4, down: 2, mine: 0 } }, outcome);
    h.nodes(n => n.type === 'button')[0].props.onClick(); await h.settle();
    assert.equal(h.nodes(n => n.type === 'button')[0].props['aria-pressed'], false);
    assert.equal(h.state[0].up, 4); assert.equal(h.nodes(n => n.props?.role === 'alert').length, 1);
    assert(h.nodes(n => n.props?.role === 'alert')[0].props.children.includes(ar ? 'ما قدرنا' : "couldn't confirm"));
  }
});
await check('comment text survives transport failure and clears only after confirmed success', async () => {
  for (const outcome of [new Error('network'), { ok: true }]) {
    const h = uiHarness('src/components/community/CommentForm.tsx', 'CommentForm', { target, path: route, ar: true, signedIn: true }, outcome);
    h.nodes(n => n.type === 'textarea')[0].props.onChange({ target: { value: 'Keep this text' } }); h.render();
    let prevented = false; h.nodes(n => n.type === 'form')[0].props.onSubmit({ preventDefault: () => { prevented = true; } }); await h.settle();
    assert.equal(prevented, true); assert.equal(h.nodes(n => n.type === 'textarea')[0].props.value, outcome instanceof Error ? 'Keep this text' : '');
    assert.equal(h.state[1].ok, !(outcome instanceof Error));
  }
});
await check('discovery form avoids automatic reset and resets only after confirmed success', async () => {
  for (const outcome of [{ ok: false, error: 'auth' }, new Error('network'), { ok: true }]) {
    const h = uiHarness('src/components/community/SubmitForm.tsx', 'SubmitForm', { ar: false }, outcome);
    const formNode = h.nodes(n => n.type === 'form')[0]; assert.equal(formNode.props.action, undefined);
    let prevented = false; formNode.props.onSubmit({ preventDefault: () => { prevented = true; }, currentTarget: {} }); await h.settle();
    assert.equal(prevented, true); assert.equal(h.resets(), outcome.ok ? 1 : 0);
    if (outcome.error === 'auth') assert(h.state[0].text.includes('Sign in'));
  }
});
await check('moderation exposes returned and transport failures in both languages', async () => {
  for (const ar of [true, false]) for (const outcome of [{ ok: false, error: 'unavailable' }, new Error('network')]) {
    const h = uiHarness('src/components/community/ModerationButton.tsx', 'ModerationButton', { kind: 'comment', id: ID, ar }, outcome);
    h.nodes(n => n.type === 'button')[0].props.onClick(); await h.settle(); assert.equal(h.nodes(n => n.props?.role === 'alert').length, 1);
  }
});

await check('pending forms freeze submitted fields and reject duplicate submission events', () => {
  for (const [file, exported, props] of [
    ['src/components/community/CommentForm.tsx', 'CommentForm', { target, path: route, ar: true, signedIn: true }],
    ['src/components/community/SubmitForm.tsx', 'SubmitForm', { ar: true }],
  ]) {
    const h = uiHarness(file, exported, props, { ok: true }, true);
    const form = h.nodes(n => n.type === 'form')[0];
    assert.equal(form.props['aria-busy'], true);
    for (const field of h.nodes(n => ['input', 'select', 'textarea'].includes(n.type))) assert.equal(field.props.disabled, true);
    let prevented = false;
    form.props.onSubmit({ preventDefault: () => { prevented = true; }, currentTarget: {} });
    assert(prevented); assert.equal(h.queued(), 0);
  }
});

console.log(`PASS ${passed} offline community data/action/UI checks`);
