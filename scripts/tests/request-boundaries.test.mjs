/* Offline adversarial checks for auth redirects, metadata, and analytics ingestion. */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import ts from 'typescript';
const root = fileURLToPath(new URL('../../', import.meta.url));
let passed = 0;
const checks = [];
async function check(name, run) { await run(); passed++; checks.push(name); }
function load(file, modules = {}, globals = {}) {
  const context = { exports: {}, require: (name) => {
    if (!(name in modules)) throw new Error('Unexpected import: ' + name);
    return modules[name];
  }, URL, Request, Response, Headers, TextDecoder, Uint8Array, AbortSignal, setTimeout, clearTimeout, ...globals };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, context, { filename: file });
  return context.exports;
}
const local = load('src/lib/local-path.ts');
const profile = load('src/lib/profile-presentation.ts');
const body = load('src/lib/small-json.ts');
function request(value, headers = {}) {
  return new Request('https://arabicgta6.com/api/track', { method: 'POST', body: value, headers: { 'content-type': 'application/json', ...headers } });
}
async function status(promise, expected) { await assert.rejects(promise, e => e.status === expected); }
(async () => {
  for (const bad of ['https://outside.example', '//outside.example', '/.//outside.example', '/a/..//outside.example', '/%2e//outside.example', '/%2e%2e//outside.example', '/\\outside.example', '/\noutside', '/\t/evil', 'javascript:alert(1)', '/\u0000', ['//evil'], null, '/' + 'a'.repeat(2048)]) {
    await check('external or malformed return path rejected: ' + JSON.stringify(bad).slice(0, 60), () => assert.equal(local.localPath(bad), '/'));
  }
  for (const good of ['/account', '/item/guide?locale=ar#details', '/search?q=%D9%81%D9%84%D9%88%D8%B3', '/%2f%2foutside.example']) {
    await check('local return path stays on-site: ' + good, () => {
      const result = local.localPath(good); assert.equal(new URL(result, 'https://arabicgta6.com').origin, 'https://arabicgta6.com'); assert.equal(result, good);
    });
  }
  await check('metadata objects do not become names or crash string methods', () => {
    assert.equal(profile.profilePresentation({ full_name: { value: 'x' }, name: 7, avatar_url: {} }).name, undefined);
    assert.equal(profile.profilePresentation({ full_name: ['x'], name: '  Player  ' }).name, 'Player');
    assert.equal(profile.profilePresentation({ full_name: 'x'.repeat(10000) }).name.length, 100);
  });
  await check('avatar scheme and credentials are restricted', () => {
    for (const avatar_url of ['javascript:alert(1)', 'data:image/svg+xml,x', 'http://example.com/a', 'https://user:pass@example.com/a']) assert.equal(profile.profilePresentation({ avatar_url }).avatar, undefined);
    assert.equal(profile.profilePresentation({ avatar_url: 'https://example.com/a.png' }).avatar, 'https://example.com/a.png');
  });
  await check('server fetch retains method/body/headers and caller cancellation', async () => {
    let received;
    const net = load('src/lib/server-fetch.ts', {}, { fetch: async (_input, init) => { received = init; return new Response('ok'); } });
    const controller = new AbortController();
    await net.serverFetch('https://backend.invalid', { method: 'POST', body: '{}', headers: { test: 'value' }, signal: controller.signal });
    assert.equal(received.method, 'POST'); assert.equal(received.body, '{}'); assert.equal(received.headers.test, 'value');
    controller.abort(); assert.equal(received.signal.aborted, true);
  });
  await check('server fetch deadline aborts a stalled request and respects Request signals', async () => {
    let received;
    const stalled = load('src/lib/server-fetch.ts', {}, { fetch: (_input, init) => {
      received = init;
      return new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true }));
    } });
    await Promise.all([
      assert.rejects(stalled.serverFetch('https://backend.invalid', undefined, 20), e => e.name === 'TimeoutError'),
      new Promise(resolve => setTimeout(resolve, 30)),
    ]);
    assert.equal(received.signal.aborted, true);
    const net = load('src/lib/server-fetch.ts', {}, { fetch: async (_input, init) => { received = init; return new Response('ok'); } });
    const controller = new AbortController();
    await net.serverFetch(new Request('https://backend.invalid', { signal: controller.signal }));
    controller.abort(); assert.equal(received.signal.aborted, true);
  });
  await check('small JSON accepts valid UTF-8 split across chunks', async () => {
    const bytes = new TextEncoder().encode('{"text":"مرحبا"}');
    const stream = new ReadableStream({ start(c) { for (const b of bytes) c.enqueue(new Uint8Array([b])); c.close(); } });
    const req = new Request('https://arabicgta6.com', { method: 'POST', duplex: 'half', body: stream, headers: { 'content-type': 'application/json; charset=UTF-8' } });
    assert.equal((await body.smallJson(req)).text, 'مرحبا');
  });
  await check('streamed oversize is rejected despite missing or false Content-Length', async () => {
    for (const headers of [{}, { 'content-length': '1' }]) await status(body.smallJson(request(' '.repeat(4097), headers)), 413);
  });
  await check('declared oversize and wrong MIME rejected before reading', async () => {
    await status(body.smallJson(request('{}', { 'content-length': '9000' })), 413);
    await status(body.smallJson(request('{}', { 'content-type': 'text/plain' })), 415);
  });
  await check('malformed JSON and invalid UTF-8 fail closed', async () => {
    await status(body.smallJson(request('{')), 400);
    await status(body.smallJson(request(new Uint8Array([0xff]))), 400);
  });
  await check('slow streaming body is cancelled at deadline', async () => {
    let cancelled = false;
    const stream = new ReadableStream({ cancel() { cancelled = true; } });
    const req = new Request('https://arabicgta6.com', { method: 'POST', duplex: 'half', body: stream, headers: { 'content-type': 'application/json' } });
    await status(body.smallJson(req, 4096, 25), 408); assert.equal(cancelled, true);
  });
  let writes = [], authReads = 0;
  const route = load('src/app/api/track/route.ts', {
    'next/server': { NextResponse: Response },
    '@/lib/small-json': body,
    '@/lib/tracking': { recordView: async value => { writes.push(value); } },
    '@/lib/session': { getViewer: async () => { authReads++; return {}; }, getLocale: async () => 'ar' },
  });
  async function track(value, headers = {}) {
    const req = request(typeof value === 'string' ? value : JSON.stringify(value), headers);
    req.nextUrl = new URL(req.url); return route.POST(req);
  }
  await check('cross-origin ingestion never reaches auth or storage', async () => {
    assert.equal((await track({ path: '/' }, { origin: 'https://outside.example' })).status, 403);
    assert.equal((await track({ path: '/' }, { 'sec-fetch-site': 'cross-site' })).status, 403);
    assert.equal(authReads, 0); assert.equal(writes.length, 0);
  });
  await check('arrays and malformed JSON cannot reach storage', async () => {
    assert.equal((await track([])).status, 400); assert.equal((await track('{')).status, 400);
    assert.equal(writes.length, 0);
  });
  await check('private, credential-bearing and fabricated routes are not tracked', async () => {
    for (const value of ['/admin', '/account', '/auth/callback', '/unsubscribe?token=secret', '/?secret=key', '//outside.example', '/invented', '/api/track']) assert.equal((await track({ path: value })).status, 204);
    assert.equal(writes.length, 0);
  });
  await check('valid page produces bounded fields; arbitrary visitor ID is discarded', async () => {
    await track({ path: '/item/guide', vid: 'forged-not-a-uuid', ref: 'javascript:alert(1)', utm_source: 'a'.repeat(500), utm_campaign: 'x\u0000y' }, { origin: 'https://arabicgta6.com' });
    assert.equal(writes.length, 1); assert.equal(writes[0].visitorId, null); assert.equal(writes[0].referrer, null);
    assert.equal(writes[0].utmSource.length, 80); assert.equal(writes[0].utmCampaign, 'xy');
  });
  await check('same visitor/path duplicate is suppressed, another page remains countable', async () => {
    const vid = 'f4d22709-b693-4c01-a385-72b24bcb977a';
    await track({ path: '/', vid }); await track({ path: '/', vid }); await track({ path: '/map', vid });
    assert.equal(writes.length, 3); assert.equal(authReads, 3);
  });
  await check('tracker strips referrer query and bounds campaign data before transmission', () => {
    let effect, payload;
    const tracker = load('src/components/Tracker.tsx', {
      react: { useEffect: fn => { effect = fn; } }, 'next/navigation': { usePathname: () => '/map' },
    }, {
      URLSearchParams, Blob,
      window: { location: { search: '?utm_source=' + 'a'.repeat(500) } },
      document: { referrer: 'https://example.com/private/path?token=secret' },
      localStorage: { getItem: () => 'f4d22709-b693-4c01-a385-72b24bcb977a' },
      navigator: { sendBeacon: (_url, blob) => { payload = blob; return true; } },
      fetch: () => { throw new Error('Unnecessary fallback'); },
    });
    tracker.Tracker(); effect();
    return payload.text().then(text => {
      const value = JSON.parse(text); assert.equal(value.ref, 'https://example.com'); assert.equal(value.utm_source.length, 80); assert(!text.includes('secret'));
    });
  });
  await check('a rejected beacon queue uses one quiet fetch fallback', async () => {
    let effect, calls = 0;
    const tracker = load('src/components/Tracker.tsx', {
      react: { useEffect: fn => { effect = fn; } }, 'next/navigation': { usePathname: () => '/' },
    }, {
      URLSearchParams, Blob,
      window: { location: { search: '' } }, document: { referrer: '' },
      localStorage: { getItem: () => { throw new Error('blocked storage'); } },
      navigator: { sendBeacon: () => false },
      fetch: () => { calls++; return Promise.reject(new Error('offline')); },
    });
    tracker.Tracker(); effect(); await new Promise(setImmediate); assert.equal(calls, 1);
  });
  console.log(`PASS ${passed} offline request-boundary checks`);
})().catch(e => { console.error(e); process.exitCode = 1; });
