/* Offline public-read resilience checks: no database, network, or wall-clock failures. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const root = fileURLToPath(new URL('../../', import.meta.url));
const req = createRequire(import.meta.url);
const seed={slug:'removed-seed-item',category:'tips',status:'official',title_en:'Old seed item',title_ar:'عنصر قديم',summary_en:'old',summary_ar:'قديم',published_at:'2020-01-01T00:00:00Z',aliases:[],tags:[],featured:true,image:null,related:[],body_en:'old',body_ar:'قديم',region:null,location:null};
const live={...seed,slug:'live-item',title_en:'Current backend item'};
function harness({configured=true,admin=false,locale='ar',handler=()=>({data:null,error:null})}={}) {
 const cache=new Map(),calls=[],deadlines=[];
 const fakeAbortSignal={timeout(ms){const controller=new AbortController();deadlines.push({ms,controller});return controller.signal;}};
 function query(kind,args){const call={kind,args,ops:[],signal:null};const q={abortSignal(signal){call.signal=signal;return q;},then(resolve,reject){calls.push(call);return Promise.resolve().then(()=>handler(call)).then(resolve,reject);}};
  for(const op of ['select','eq','order','limit','like','gte','in','or','maybeSingle'])q[op]=(...a)=>{call.ops.push([op,...a]);return q;};return q;
 }
 const client={from:table=>query('from',table),rpc:(name,args)=>query('rpc',{name,...args})};
 function load(file){
  if(cache.has(file))return cache.get(file);
  const source=fs.readFileSync(path.join(root,file),'utf8');
  const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const m={exports:{}};cache.set(file,m.exports);
  const requireLocal=name=>{
   if(name==='server-only')return {};
   if(name==='react')return {...React,cache:f=>f,useSyncExternalStore:(_subscribe,get)=>get()};
   if(name==='./supabase/server')return {supabaseConfigured:()=>configured,createClient:async()=>client};
   if(name==='./admin')return {adminConfigured:()=>admin,adminClient:()=>client};
   if(name==='./seed')return {SEED:[seed]};
   if(name==='@/lib/session')return {getLocale:async()=>locale};
   if(name==='next/server')return {NextResponse:{json:(body,o={})=>({body,status:o.status??200,headers:new Headers(o.headers)})}};
   if(name==='next/link')return {__esModule:true,default:({children,...props})=>React.createElement('a',props,children)};
   if(name.startsWith('.')||name.startsWith('@/')){const stem=name.startsWith('@/')?'src/'+name.slice(2):path.join(path.dirname(file),name);const target=['.ts','.tsx',''].map(e=>stem+e).find(p=>fs.existsSync(path.join(root,p)));return load(target);}
   return req(name);
  };
  vm.runInNewContext(`(function(require,module,exports){${js}\n})`,{console,AbortSignal:fakeAbortSignal,document:{documentElement:{lang:locale}},URL,Headers})(requireLocal,m,m.exports);cache.set(file,m.exports);return m.exports;
 }
 return {load,calls,deadlines};
}
const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve();};
let passed=0;async function test(name,fn){await fn();passed++;console.log('PASS',name);}
async function unavailable(p){await assert.rejects(p,e=>e.name==='PublicReadError');}
(async()=>{
 await test('returned query errors never become item404 or seed resurrection',async()=>{
  const h=harness({handler:()=>({data:null,error:{message:'backend unavailable'}})}),d=h.load('src/lib/data.ts');
  await unavailable(d.getItem(seed.slug,true));await unavailable(d.getItem(seed.slug,false));await unavailable(d.itemExists(seed.slug));
 });
 await test('successful absence is null even when same slug remains in seed',async()=>{
  const h=harness(),d=h.load('src/lib/data.ts');assert.equal(await d.getItem(seed.slug,true),null);assert.equal(await d.itemExists(seed.slug),null);
 });
 await test('counts/list/map/related/daily/tips/guest failures are explicit',async()=>{
  const h=harness({handler:()=>({data:null,error:{code:'503'}})}),d=h.load('src/lib/data.ts');
  for(const invoke of [()=>d.getCounts(),()=>d.getLatest(),()=>d.getCategory('tips'),()=>d.getMapItems(),()=>d.getBySlugs([seed.slug]),()=>d.getDailyPool(),()=>d.getTipCards(),()=>d.getGuestNews()])await unavailable(invoke());
 });
 await test('transport rejection is normalized without a false empty response',async()=>{
  const h=harness({handler:()=>Promise.reject(new Error('network'))});await unavailable(h.load('src/lib/data.ts').getLatest());
 });
 await test('deadline bounds a transport that ignores cancellation',async()=>{
  const h=harness({handler:()=>new Promise(()=>{})});const p=h.load('src/lib/data.ts').getLatest();await flush();assert.equal(h.deadlines.length,1);assert.equal(h.deadlines[0].ms,4000);const check=unavailable(p);h.deadlines[0].controller.abort();await check;assert.equal(h.calls[0].signal.aborted,true);
 });
 await test('successful empty lists remain valid and related order stays curated',async()=>{
  let order=false;const h=harness({handler:()=>({data:order?[{...live,slug:'b'},{...live,slug:'a'}]:[],error:null})}),d=h.load('src/lib/data.ts');assert.equal((await d.getLatest()).length,0);assert.equal(Object.keys(await d.getCounts()).length,0);order=true;assert.deepEqual(Array.from(await d.getBySlugs(['a','b']),x=>x.slug),['a','b']);
 });
 await test('unconfigured preview alone may use seed and does not query backend',async()=>{
  const h=harness({configured:false,handler:()=>{throw new Error('must not query')}}),d=h.load('src/lib/data.ts');assert.equal((await d.getItem(seed.slug,true)).slug,seed.slug);assert.equal((await d.getLatest())[0].slug,seed.slug);assert.equal(h.calls.length,0);
 });
 await test('analytics failure falls back to actual live editorial/latest cards',async()=>{
  const h=harness({admin:true,handler:c=>c.args==='page_views'?{data:null,error:{code:'denied'}}:{data:[live],error:null}}),d=h.load('src/lib/data.ts');const found=await d.getFeatured();assert.deepEqual(Array.from(found,x=>x.slug),[live.slug]);assert.ok(h.deadlines.some(d=>d.ms===1500));
 });
 await test('optional popular-item failure preserves live cards, required reads fail',async()=>{
  const h=harness({admin:true,handler:c=>c.args==='page_views'?{data:[{path:'/item/popular',visitor_id:'v'}],error:null}:c.ops.some(o=>o[0]==='in')?{data:null,error:{code:'failed'}}:{data:[live],error:null}});assert.equal((await h.load('src/lib/data.ts').getFeatured())[0].slug,live.slug);
  const bad=harness({handler:()=>({data:null,error:{message:'offline'}})});await unavailable(bad.load('src/lib/data.ts').getFeatured());
 });
 await test('partial search errors cannot masquerade as legitimate no matches',async()=>{
  const h=harness({handler:c=>c.args.q.includes(' ')?{data:[],error:null}:c.args.q==='alpha'?{data:null,error:{code:'failed'}}:{data:[live],error:null}});await unavailable(h.load('src/lib/data.ts').search('alpha beta gamma'));
  assert.equal(h.deadlines.length,1);assert.equal(new Set(h.calls.map(c=>c.signal)).size,1);
 });
 await test('one shared search deadline covers exact plus at most5 parallel fallbacks',async()=>{
  const h=harness({handler:c=>c.args.q.includes(' ')?{data:[],error:null}:new Promise(()=>{})});const p=h.load('src/lib/data.ts').search('alpha beta gamma delta epsilon zeta');await flush();assert.equal(h.calls.length,6);assert.equal(h.deadlines.length,1);assert.equal(new Set(h.calls.map(c=>c.signal)).size,1);const check=unavailable(p);h.deadlines[0].controller.abort();await check;
 });
 await test('API503 is uncacheable, generic and has no fake empty results',async()=>{
  const h=harness({handler:()=>({data:null,error:{message:'private backend secret'}})});const r=await h.load('src/app/api/search/route.ts').GET({nextUrl:new URL('https://example.test/api/search?q=alpha')});assert.equal(r.status,503);assert.equal(r.headers.get('cache-control'),'no-store');assert.equal(r.body.error,'search_unavailable');assert.ok(!('results'in r.body));assert.ok(!JSON.stringify(r.body).includes('private'));
 });
 await test('API200 retains truthful empty results/catalog contract',async()=>{
  const h=harness({handler:()=>({data:[],error:null})});const r=await h.load('src/app/api/search/route.ts').GET({nextUrl:new URL('https://example.test/api/search?q=notarealmodelxyzz')});assert.equal(r.status,200);assert.equal(r.body.results.length,0);assert.ok(Array.isArray(r.body.catalog));assert.equal(r.headers.get('cache-control'),'no-store');
 });
 await test('localized boundary retry invokes Next retry without leaking error',async()=>{
  for(const locale of ['ar','en']){const h=harness({locale});let n=0;const tree=h.load('src/app/error.tsx').default({error:new Error('private backend secret'),retry:()=>n++});const html=renderToStaticMarkup(tree);assert.ok(html.includes(locale==='ar'?'حاول مرة ثانية':'Try again'));assert.ok(!html.includes('private'));function visit(x){if(!x||typeof x!=='object')return;if(x.type==='button')x.props.onClick();for(const c of React.Children.toArray(x.props?.children))visit(c);}visit(tree);assert.equal(n,1);}
 });
 await test('localized404 has search/home exits and no backend dependency',async()=>{
  for(const locale of ['ar','en']){const h=harness({locale});const html=renderToStaticMarkup(await h.load('src/app/not-found.tsx').default());assert.ok(html.includes('404'));assert.ok(html.includes(locale==='ar'?'ما لقينا هالصفحة':'Page not found'));assert.ok(html.includes('href="/search"'));assert.ok(html.includes('href="/"'));assert.equal(h.calls.length,0);}
 });
 console.log(`PASS ${passed} offline public-read resilience checks`);
})().catch(e=>{console.error(e);process.exitCode=1});
