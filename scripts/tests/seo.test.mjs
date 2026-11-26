/* Offline metadata/sitemap checks. No network, browser, database, or service writes. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const root=process.env.SEO_REPO??fileURLToPath(new URL('../../',import.meta.url));
const base=process.env.SEO_BASE??root;
const req=createRequire(path.join(root,'package.json')),ts=req('typescript');
const seed={slug:'seed-item',category:'tips',status:'official',title_ar:'عنوان محايد',title_en:'Neutral title',summary_ar:'وصف مكشوف',summary_en:'Revealing detail',body_ar:'تفصيل خاص',body_en:'Hidden story',aliases:['REVEAL-ALIAS'],tags:[],image:'https://images.example/secret-scene.jpg',published_at:'2026-11-20T00:00:00Z',facts:[],related:[],sources:[],location:null,spots:[],region:null};
function harness({configured=true,rows=[],serverCap=500,item=seed,locale='ar',handler}={}){
 const cache=new Map(),calls=[],deadlines=[];
 const abort={timeout(ms){const ctrl=new AbortController();deadlines.push({ms,ctrl});return ctrl.signal}};
 const client={from(table){const c={table,ops:[],signal:null};const q={abortSignal(s){c.signal=s;return q},then(resolve,reject){calls.push(c);return Promise.resolve().then(()=>{
   if(handler)return handler(c);const after=c.ops.find(o=>o[0]==='gt')?.[2];const limit=c.ops.find(o=>o[0]==='limit')?.[1]??500;
   return {data:rows.filter(r=>!after||r.slug>after).slice(0,Math.min(limit,serverCap)),error:null};
  }).then(resolve,reject)}};for(const op of ['select','order','limit','gt','eq','maybeSingle'])q[op]=(...args)=>{c.ops.push([op,...args]);return q};return q}};
 function load(relative){if(cache.has(relative))return cache.get(relative);
  const filename=fs.existsSync(path.join(base,relative))?path.join(base,relative):path.join(root,relative);
  const js=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const m={exports:{}};cache.set(relative,m.exports);
  function localRequire(name){
   if(name==='server-only')return {};
   if(name==='@supabase/supabase-js')return {createClient:()=>client};
   if(name==='./supabase/server')return {createClient:async()=>client,supabaseConfigured:()=>configured};
   if(name==='./seed')return {SEED:[seed]};
   if(name==='@/lib/session')return {getLocale:async()=>locale,getViewer:async()=>({member:true,signedIn:false})};
   if(name==='@/lib/data')return {getItem:async()=>item,itemExists:async()=>null,getBySlugs:async()=>[],getLatest:async()=>[]};
   if(name==='@/lib/community/data')return {getVotes:async()=>({})};
   if(name.startsWith('@/components/'))return new Proxy({},{get:(_t,k)=>k==='__esModule'?true:()=>null});
   if(name==='next/link')return {__esModule:true,default:()=>null};
   if(name==='next/navigation')return {notFound(){throw new Error('not-found')}};
   if(name.startsWith('@/')||name.startsWith('.')){const stem=name.startsWith('@/')?'src/'+name.slice(2):path.join(path.dirname(relative),name);const p=['.ts','.tsx',''].map(e=>stem+e).find(p=>fs.existsSync(path.join(base,p))||fs.existsSync(path.join(root,p)));if(p)return load(p)}
   return req(name);
  }
  vm.runInNewContext(`(function(require,module,exports){${js}\n})`,{console,AbortSignal:abort,process:{cwd:()=>root,env:{NEXT_PUBLIC_SITE_URL:'https://arabicgta6.com',...(configured?{NEXT_PUBLIC_SUPABASE_URL:'https://example.supabase.co',NEXT_PUBLIC_SUPABASE_ANON_KEY:'offline-placeholder'}:{})}},URL,Date})(localRequire,m,m.exports);cache.set(relative,m.exports);return m.exports;
 }
 return {load,calls,deadlines};
}
const rows=n=>Array.from({length:n},(_,i)=>({slug:`item-${String(i).padStart(5,'0')}`,published_at:seed.published_at}));
const flush=async()=>{for(let i=0;i<15;i++)await Promise.resolve()};
let passed=0;async function test(name,fn){await fn();console.log('PASS',name);passed++}
await test('sitemap exceeds1000 using narrow stable keyset queries',async()=>{const h=harness({rows:rows(1501)}),got=await h.load('src/lib/sitemap-items.ts').getSitemapItems();assert.equal(got.length,1501);assert.equal(h.calls.length,5);assert.ok(h.calls.every(c=>c.ops.find(o=>o[0]==='select')[1]==='slug,published_at'));assert.equal(new Set(h.calls.map(c=>c.signal)).size,1);assert.equal(h.deadlines[0].ms,4000)});
await test('a lower backend page cap never silently truncates sitemap',async()=>{const h=harness({rows:rows(220),serverCap:100});assert.equal((await h.load('src/lib/sitemap-items.ts').getSitemapItems()).length,220);assert.equal(h.calls.length,4)});
await test('configured empty result is valid; preview alone uses seed',async()=>{const live=harness();assert.equal((await live.load('src/lib/sitemap-items.ts').getSitemapItems()).length,0);const demo=harness({configured:false});assert.equal((await demo.load('src/lib/sitemap-items.ts').getSitemapItems())[0].slug,seed.slug);assert.equal(demo.calls.length,0)});
await test('query errors or null data fail instead of publishing partial sitemap',async()=>{for(const result of [{data:[],error:{message:'private'}},{data:null,error:null}]){const h=harness({handler:()=>result});await assert.rejects(h.load('src/lib/sitemap-items.ts').getSitemapItems(),e=>e.name==='PublicReadError')}});
await test('duplicates malformed dates and path traversal cannot enter sitemap',async()=>{for(const row of [{...seed,slug:'../secret'},{...seed,published_at:'bad-date'},seed]){const h=harness({handler:()=>({data:[row,row],error:null})});await assert.rejects(h.load('src/lib/sitemap-items.ts').getSitemapItems(),e=>e.name==='PublicReadError')}});
await test('hard capacity overflow fails visibly instead of truncating',async()=>{const h=harness({rows:rows(20001)});await assert.rejects(h.load('src/lib/sitemap-items.ts').getSitemapItems(),e=>e.name==='PublicReadError');assert.equal(h.calls.length,41)});
await test('shared total deadline bounds a transport ignoring abort',async()=>{const h=harness({handler:()=>new Promise(()=>{})});const p=h.load('src/lib/sitemap-items.ts').getSitemapItems();await flush();const check=assert.rejects(p,e=>e.name==='PublicReadError');h.deadlines[0].ctrl.abort();await check;assert.equal(h.calls[0].signal.aborted,true)});
await test('public metadata uses base canonical and localized social title without fake hreflang',async()=>{for(const locale of ['ar','en']){const h=harness(),m=h.load('src/lib/public-metadata.ts').publicMetadata('/map',locale,{title:locale==='ar'?'الخريطة':'Map'});assert.equal(m.alternates.canonical,'/map');assert.equal(m.alternates.languages,undefined);assert.equal(m.openGraph.title,locale==='ar'?'الخريطة':'Map');assert.equal(m.openGraph.locale,locale==='ar'?'ar_SA':'en_US');assert.equal(m.twitter.card,'summary_large_image');assert.equal(m.openGraph.images[0].url,'/opengraph-image');assert.equal(m.openGraph.images[0].width,1200);assert.equal(m.openGraph.images[0].height,630);assert.equal(m.twitter.images[0],'/opengraph-image')}});
await test('private and unreviewed community layouts prevent indexing',async()=>{for(const route of ['login','account','community'])assert.equal(harness().load(`src/app/${route}/layout.tsx`).metadata.robots.index,false);const robots=harness().load('src/app/robots.ts').default();assert.ok(!robots.rules[0].disallow.includes('/account'));assert.ok(!robots.rules[0].disallow.includes('/community'))});
function find(tree,predicate){if(!tree||typeof tree!=='object')return; if(predicate(tree))return tree;for(const child of [tree.props?.children].flat(Infinity)){const result=find(child,predicate);if(result)return result}}
await test('spoiler keywords and structured image remain neutral in both languages',async()=>{for(const locale of ['ar','en']){const h=harness({item:{...seed,tags:['ENDING-SPOILER']},locale}),page=h.load('src/app/item/[slug]/page.tsx');const meta=await page.generateMetadata({params:Promise.resolve({slug:seed.slug})});assert.ok(!meta.keywords.includes('REVEAL-ALIAS'));assert.ok(!meta.description.includes('Revealing'));const tree=await page.default({params:Promise.resolve({slug:seed.slug})});const script=find(tree,n=>n.type==='script'&&n.props.type==='application/ld+json');const data=JSON.parse(script.props.dangerouslySetInnerHTML.__html);assert.equal(data.image,'https://arabicgta6.com/img/ultimate.webp');assert.ok(!JSON.stringify(data).includes('secret-scene'));const wrap=find(tree,n=>n.props?.on===true&&typeof n.type==='function');const details=wrap.type(wrap.props);assert.ok(find(details,n=>n.type==='div'&&n.props['data-nosnippet']===true))}});
await test('ordinary article retains its actual cover and aliases',async()=>{const page=harness().load('src/app/item/[slug]/page.tsx');const meta=await page.generateMetadata({params:Promise.resolve({slug:seed.slug})});assert.ok(meta.keywords.includes('REVEAL-ALIAS'));const tree=await page.default({params:Promise.resolve({slug:seed.slug})});const data=JSON.parse(find(tree,n=>n.type==='script').props.dangerouslySetInnerHTML.__html);assert.equal(data.image,seed.image)});
await test('JSON-LD serialization cannot close its script element',()=>{const ld=harness().load('src/lib/jsonld.ts').jsonLd({headline:'</script><script>alert(1)</script>'});assert.ok(!ld.includes('<'));assert.equal(JSON.parse(ld).headline,'</script><script>alert(1)</script>')});
await test('sitemap includes discovery pages, excludes unreviewed community, no invented current lastmod',async()=>{const h=harness({configured:false}),map=await h.load('src/app/sitemap.ts').default();assert.ok(map.some(x=>x.url.endsWith('/explore')));assert.ok(map.some(x=>x.url.endsWith('/privacy')));assert.ok(!map.some(x=>x.url.includes('/community')));assert.equal(map.find(x=>x.url==='https://arabicgta6.com').lastModified,undefined)});
await test('OG successful absence never resurrects a removed seed cover',async()=>{const h=harness({handler:()=>({data:null,error:null})});const result=await h.load('src/lib/og-image.tsx').loadCard(seed.slug);assert.equal(result.card,null);assert.equal(result.ok,true);assert.equal(h.deadlines[0].ms,3000)});
await test('OG configured errors return neutral short-cache state without secrets',async()=>{for(const handler of [()=>({data:null,error:{message:'private-secret'}}),()=>Promise.reject(new Error('private-secret'))]){const h=harness({handler});const result=await h.load('src/lib/og-image.tsx').loadCard(seed.slug);assert.equal(result.card,null);assert.equal(result.ok,false);assert.ok(!JSON.stringify(result).includes('private-secret'))}});
await test('OG deadline bounds ignored abort and never falls back to old seed',async()=>{const h=harness({handler:()=>new Promise(()=>{})}),pending=h.load('src/lib/og-image.tsx').loadCard(seed.slug);await flush();h.deadlines[0].ctrl.abort();const result=await pending;assert.equal(result.card,null);assert.equal(result.ok,false);assert.equal(h.calls[0].signal.aborted,true)});
await test('OG live article wins; seed remains available only in unconfigured preview',async()=>{const live={...seed,title_ar:'عنوان حديث'},h=harness({handler:()=>({data:live,error:null})});assert.equal((await h.load('src/lib/og-image.tsx').loadCard(seed.slug)).card.title_ar,'عنوان حديث');const preview=harness({configured:false});assert.equal((await preview.load('src/lib/og-image.tsx').loadCard(seed.slug)).card.title_ar,seed.title_ar);assert.equal(preview.calls.length,0)});
console.log(`PASS ${passed} offline SEO checks`);
