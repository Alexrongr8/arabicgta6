/* Offline browser-API and image fallbacks: never opens a share sheet or contacts a source. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import ts from 'typescript';
import sharp from 'sharp';
const require = createRequire(import.meta.url);
const root = new URL('../../', import.meta.url);
function compile(file) {
  return ts.transpileModule(fs.readFileSync(new URL(file, root), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
}
function find(tree, predicate, result = []) {
  if (Array.isArray(tree)) for (const child of tree) find(child, predicate, result);
  else if (tree && typeof tree === 'object') { if (predicate(tree)) result.push(tree); find(tree.props?.children, predicate, result); }
  return result;
}
function component(file, name, props, navigator = {}) {
  let cursor = 0, tree;
  const slots = [];
  const react = {
    useState(initial) { const i = cursor++; if (!(i in slots)) slots[i] = initial; return [slots[i], value => { slots[i] = typeof value === 'function' ? value(slots[i]) : value; }]; },
    useRef(initial) { const i = cursor++; return slots[i] ?? (slots[i] = { current: initial }); },
  };
  const modules = { react, 'lucide-react': {}, 'react/jsx-runtime': { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) } };
  const context = { exports: {}, URL, navigator, window: { location: { origin: 'https://arabicgta6.com', pathname: '/item/example', href: 'https://arabicgta6.com/item/example?utm_campaign=private#section' } }, require: id => { assert(id in modules, id); return modules[id]; } };
  vm.runInNewContext(compile(file), context);
  const render = () => { cursor = 0; tree = context.exports[name](props); return tree; };
  render();
  return { render, props, nodes: predicate => find(tree, predicate), button: () => find(tree, node => node.type === 'button')[0] };
}
let passed = 0;
async function check(name, fn) { await fn(); passed++; console.log('PASS ' + name); }
const share = (navigator, locale = 'ar') => component('src/components/ShareButton.tsx', 'ShareButton', { title: 'Article title', label: 'Share', locale }, navigator);
await check('clipboard fallback confirms a clean article URL in both languages', async () => {
  for (const locale of ['ar', 'en']) {
    const copied = [], h = share({ clipboard: { writeText: async text => copied.push(text) } }, locale);
    await h.button().props.onClick(); h.render();
    assert.deepEqual(copied, ['https://arabicgta6.com/item/example']);
    assert.equal(h.nodes(n => n.props?.role === 'status')[0].props.children, locale === 'ar' ? 'تم نسخ الرابط' : 'Link copied');
    assert.equal(h.button().props.disabled, false);
  }
});
await check('native share receives clean URL and does not claim clipboard success', async () => {
  const payloads = [], h = share({ share: async payload => payloads.push(payload) }); await h.button().props.onClick(); h.render();
  assert.equal(payloads[0].url, 'https://arabicgta6.com/item/example'); assert.equal(payloads[0].title, 'Article title');
  assert.equal(h.nodes(n => n.props?.role === 'status')[0].props.children, '');
});
await check('user cancelling native share does not silently copy or show an error', async () => {
  let copies = 0; const h = share({ share: async () => { throw { name: 'AbortError' }; }, clipboard: { writeText: async () => copies++ } });
  await h.button().props.onClick(); h.render(); assert.equal(copies, 0); assert.equal(h.nodes(n => n.type === 'input').length, 0);
});
await check('native share failure tries clipboard; blocked or missing clipboard exposes a selectable link', async () => {
  let copies = 0;
  const h = share({ share: async () => { throw new Error('unsupported'); }, clipboard: { writeText: async () => copies++ } });
  await h.button().props.onClick(); h.render(); assert.equal(copies, 1);
  for (const nav of [{}, { clipboard: { writeText: async () => { throw new Error('denied'); } } }]) {
    const unavailable = share(nav); await unavailable.button().props.onClick(); unavailable.render();
    const input = unavailable.nodes(n => n.type === 'input')[0]; assert.equal(input.props.readOnly, true); assert.equal(input.props.value, 'https://arabicgta6.com/item/example');
    let selected = false; input.props.onFocus({ currentTarget: { select: () => { selected = true; } } }); assert(selected);
  }
});
await check('rapid duplicate clicks cannot open multiple native share requests', async () => {
  let resolve, calls = 0; const h = share({ share: () => { calls++; return new Promise(r => { resolve = r; }); } });
  const first = h.button().props.onClick(); await h.button().props.onClick(); h.render(); assert.equal(calls, 1); assert.equal(h.button().props.disabled, true);
  resolve(); await first; h.render(); assert.equal(h.button().props.disabled, false);
});
await check('article failures switch to a credited neutral image, then a stable unavailable state', () => {
  const h = component('src/components/Cover.tsx', 'CoverFigure', { src: '/t/article?w=1280', fallback: '/img/thumb/vice-city-1280.webp', alt: 'Specific subject', credit: 'source.example', locale: 'ar' });
  assert.equal(h.nodes(n => n.type === 'img')[0].props.alt, 'Specific subject');
  h.nodes(n => n.type === 'img')[0].props.onError(); h.render();
  assert.equal(h.nodes(n => n.type === 'img')[0].props.src, h.props.fallback); assert.equal(h.nodes(n => n.type === 'img')[0].props.alt, '');
  assert(JSON.stringify(h.nodes(n => n.type === 'figcaption')[0]).includes('صورة توضيحية'));
  assert(!JSON.stringify(h.nodes(n => n.type === 'figcaption')[0]).includes('source.example'));
  h.nodes(n => n.type === 'img')[0].props.onError(); h.render(); assert.equal(h.nodes(n => n.type === 'img').length, 0); assert.equal(h.nodes(n => n.props?.role === 'status').length, 1);
  h.props.src = '/t/new-article?w=1280'; h.render(); assert.equal(h.nodes(n => n.type === 'img')[0].props.src, h.props.src);
});
await check('card fallback attempts terminate even when original and fallback are identical', () => {
  const h = component('src/components/Cover.tsx', 'Cover', { src: '/same.webp', fallback: '/same.webp' });
  h.nodes(n => n.type === 'img')[0].props.onError(); assert.equal(h.render(), null);
});
await check('cached image errors before hydration still show the credited fallback', () => {
  for (const name of ['Cover', 'CoverFigure']) {
    const h = component('src/components/Cover.tsx', name, { src: '/broken.webp', fallback: '/fallback.webp', alt: 'Subject', credit: 'source.example', locale: 'en' });
    h.nodes(n => n.type === 'img')[0].props.ref({ complete: false, naturalWidth: 0 }); h.render();
    assert.equal(h.nodes(n => n.type === 'img')[0].props.src, '/broken.webp');
    h.nodes(n => n.type === 'img')[0].props.ref({ complete: true, naturalWidth: 0 }); h.render();
    assert.equal(h.nodes(n => n.type === 'img')[0].props.src, '/fallback.webp');
    h.nodes(n => n.type === 'img')[0].props.ref({ complete: true, naturalWidth: 1280 }); h.render();
    assert.equal(h.nodes(n => n.type === 'img')[0].props.src, '/fallback.webp');
    if (name === 'CoverFigure') assert(JSON.stringify(h.nodes(n => n.type === 'figcaption')[0]).includes('Illustrative image'));
    h.nodes(n => n.type === 'img')[0].props.ref({ complete: true, naturalWidth: 0 }); h.render();
    assert.equal(h.nodes(n => n.type === 'img').length, 0);
  }
});
const sample = await sharp({ create: { width: 24, height: 24, channels: 3, background: '#8040a0' } }).webp().toBuffer();
function thumbRoute(bytes = sample) {
  class NextResponse extends Response { static redirect(url, status) { return new NextResponse(null, { status, headers: { Location: String(url) } }); } }
  const imageModule = { exports: {} }; vm.runInNewContext(compile('src/lib/image.ts'), imageModule);
  const context = { exports: {}, Uint8Array, URL, require: id => {
    if (id === 'next/server') return { NextResponse };
    if (id === '@/lib/og-image') return { loadCard: async () => ({ card: { slug: 'article', category: 'tips', image: 'https://source.example/large.png' }, ok: true }), coverBytes: async () => bytes };
    if (id === '@/lib/image') return imageModule.exports;
    if (id === '@/lib/spoiler') return { isSpoiler: () => false };
    return require(id);
  } };
  vm.runInNewContext(compile('src/app/t/[slug]/route.ts'), context);
  return width => context.exports.GET({ nextUrl: new URL('https://arabicgta6.com/t/article?w=' + width) }, { params: Promise.resolve({ slug: 'article' }) });
}
await check('article variant produces a bounded1280x720 WebP and rejects arbitrary widths', async () => {
  const get = thumbRoute(), response = await get(1280); assert.equal(response.status, 200);
  const metadata = await sharp(Buffer.from(await response.arrayBuffer())).metadata(); assert.equal(metadata.width, 1280); assert.equal(metadata.height, 720); assert.equal(metadata.format, 'webp');
  assert.equal((await get(3000)).status, 400);
});
await check('hero failure is detectable by client while card failure retains its local redirect', async () => {
  const get = thumbRoute(null), hero = await get(1280), card = await get(640);
  assert.equal(hero.status, 503); assert.equal(hero.headers.get('location'), null); assert.equal(card.status, 302); assert(card.headers.get('location').endsWith('/img/thumb/ultimate-640.webp'));
});
await check('all shared hero fallback assets have stable1280x720 dimensions', async () => {
  const originals = fs.readdirSync(new URL('public/img/', root)).filter(name => name.endsWith('.webp'));
  for (const name of originals) {
    const file = new URL('public/img/thumb/' + name.replace('.webp', '-1280.webp'), root), metadata = await sharp(fs.readFileSync(file)).metadata();
    assert.equal(metadata.width, 1280); assert.equal(metadata.height, 720); assert.equal(metadata.format, 'webp');
  }
  assert(originals.length > 0);
});
console.log(`PASS ${passed} offline share/media checks`);
