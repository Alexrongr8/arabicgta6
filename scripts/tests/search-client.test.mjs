import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import assert from 'node:assert/strict';
const source = fs.readFileSync(new URL('../../src/components/SearchClient.tsx', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const card = (slug) => ({ slug, category: 'tips', title_ar: slug, title_en: slug });
function nodes(tree, match, found = []) {
  if (Array.isArray(tree)) for (const node of tree) nodes(node, match, found);
  else if (tree && typeof tree === 'object') { if (match(tree)) found.push(tree); nodes(tree.props?.children, match, found); }
  return found;
}
function setup(initialQuery = '', initialResults = []) {
  const state = [], effects = [], timers = new Map(), requests = [], urls = [];
  let cursor = 0, timerId = 0, pending = [], tree;
  const react = {
    useState: initial => { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], value => { state[index] = typeof value === 'function' ? value(state[index]) : value; }]; },
    useRef: initial => { const index = cursor++; return state[index] ?? (state[index] = { current: initial }); },
    useEffect: (fn, deps) => { const index = cursor++; const prior = effects[index]; if (!prior || deps.some((v, n) => !Object.is(v, prior.deps[n]))) pending.push({ index, fn, deps }); },
  };
  const modules = { react, 'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) }, 'lucide-react': {}, '@/lib/categories': { CATEGORIES: [] }, 'next/link': 'Link', './ItemCard': { ItemCard: 'ItemCard' } };
  const context = { exports: {}, require: name => { assert(name in modules, name); return modules[name]; }, AbortController, window: { history: { replaceState: (_state, _title, url) => urls.push(url) } },
    setTimeout: (fn, ms) => { const id = ++timerId; timers.set(id, { fn, ms }); return id; }, clearTimeout: id => timers.delete(id),
    fetch: (url, options) => new Promise((resolve, reject) => { requests.push({ url, signal: options.signal, resolve: (data, ok = true) => resolve({ ok, status: ok ? 200 : 503, json: async () => data }), reject }); }),
  };
  vm.runInNewContext(compiled, context);
  const props = { locale: 'ar', initialQuery, initialResults, initialCatalog: [], popular: [], labels: { placeholder: 'ابحث', empty: 'empty', hint: 'hint', popular: 'popular', results: 'results' } };
  const render = () => { cursor = 0; pending = []; tree = context.exports.SearchClient(props); for (const effect of pending) { effects[effect.index]?.clean?.(); effects[effect.index] = { deps: effect.deps, clean: effect.fn() }; } return tree; };
  const input = () => nodes(tree, node => node.type === 'input')[0];
  const change = value => { input().props.onChange({ target: { value } }); render(); };
  const fire = ms => { const entry = [...timers].find(([, value]) => value.ms === ms); assert(entry, 'Missing timer ' + ms); timers.delete(entry[0]); return entry[1].fn(); };
  render();
  return { state, timers, requests, urls, render, change, fire, nodes: predicate => nodes(tree, predicate), props };
}
let passed = 0;
async function check(name, run) { await run(); passed++; console.log('PASS ' + name); }
await check('server-rendered initial results do not trigger another query', () => { const r = setup('initial', [card('initial')]); assert.equal(r.timers.size, 0); assert.equal(r.nodes(n => n.type === 'ItemCard').length, 1); });
await check('new query hides old results and updates shareable URL without router fetch', async () => { const r = setup('initial', [card('initial')]); r.change('تمساح'); assert.equal(r.nodes(n => n.type === 'ItemCard').length, 0); assert.equal(r.urls.at(-1), '/search?q=' + encodeURIComponent('تمساح')); const pending = r.fire(220); r.requests[0].resolve({ results: [card('new')], catalog: [] }); await pending; r.render(); assert.equal(r.nodes(n => n.type === 'ItemCard')[0].props.item.slug, 'new'); });
await check('rapid typing cancels debounce before any stale request', async () => { const r = setup(); r.change('one'); r.change('two'); const pending = r.fire(220); assert.equal(r.requests.length, 1); assert(r.requests[0].url.endsWith('two')); r.requests[0].resolve({ results: [], catalog: [] }); await pending; });
await check('out-of-order response cannot overwrite the newer query', async () => { const r = setup(); r.change('one'); const one = r.fire(220); r.change('two'); assert.equal(r.requests[0].signal.aborted, true); const two = r.fire(220); r.requests[1].resolve({ results: [card('two')], catalog: [] }); await two; r.requests[0].resolve({ results: [card('one')], catalog: [] }); await one; r.render(); assert.equal(r.nodes(n => n.type === 'ItemCard')[0].props.item.slug, 'two'); });
await check('clearing aborts the request and late results stay hidden', async () => { const r = setup(); r.change('one'); const pending = r.fire(220); r.change(''); assert.equal(r.requests[0].signal.aborted, true); r.requests[0].resolve({ results: [card('one')], catalog: [] }); await pending; r.render(); assert.equal(r.nodes(n => n.type === 'ItemCard').length, 0); assert.equal(r.urls.at(-1), '/search'); });
await check('timeout exposes retry and retry recovers', async () => { const r = setup(); r.change('one'); const pending = r.fire(220); r.fire(8000); assert.equal(r.requests[0].signal.aborted, true); r.requests[0].resolve({ results: [], catalog: [] }); await pending; r.render(); assert.equal(r.nodes(n => n.props?.role === 'alert').length, 1); const retry = r.nodes(n => n.type === 'button' && n.props.children === 'حاول مرة ثانية')[0]; retry.props.onClick(); r.render(); const again = r.fire(220); r.requests[1].resolve({ results: [card('recovered')], catalog: [] }); await again; r.render(); assert.equal(r.nodes(n => n.props?.role === 'alert').length, 0); assert.equal(r.nodes(n => n.type === 'ItemCard')[0].props.item.slug, 'recovered'); });
await check('malformed server response exposes retry instead of crashing filters', async () => { const r = setup(); r.change('one'); const pending = r.fire(220); r.requests[0].resolve({ results: {}, catalog: [] }); await pending; r.render(); assert.equal(r.nodes(n => n.props?.role === 'alert').length, 1); });
await check('returning to initial term restores its cached results', async () => { const r = setup('initial', [card('initial')]); r.change('other'); const pending = r.fire(220); r.change('initial'); r.requests[0].resolve({ results: [card('other')], catalog: [] }); await pending; r.render(); assert.equal(r.nodes(n => n.type === 'ItemCard')[0].props.item.slug, 'initial'); assert.equal(r.timers.size, 0); });
await check('input query is bounded before URL and network use', async () => { const r = setup(); r.change('x'.repeat(500)); assert.equal(r.state[0].length, 80); const pending = r.fire(220); assert.equal(new URL(r.requests[0].url, 'https://local.invalid').searchParams.get('q').length, 80); r.requests[0].resolve({ results: [], catalog: [] }); await pending; });
console.log(`PASS ${passed} offline search interaction checks`);
