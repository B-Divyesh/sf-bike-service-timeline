import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const buildId = process.env.VITE_BUILD_ID || 'polish-2';
const files = [];
async function walk(dir) {
  for (const name of await readdir(dir)) {
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) await walk(path);
    else if (!name.endsWith('.map') && name !== 'sw.js') files.push('/' + relative(root, path));
  }
}
await walk(root);
for (const path of files.filter((path) => path.endsWith('.html'))) {
  const absolute = join(root, path.slice(1));
  await writeFile(absolute, (await readFile(absolute, 'utf8')).replaceAll('__BUILD_ID__', buildId));
}
const signature = createHash('sha256').update(files.sort().join('|')).digest('hex').slice(0, 10);
const sw = `const CACHE='bike-timeline-${signature}';
const SHELL=${JSON.stringify(files)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL))));
self.addEventListener('activate',event=>event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))),self.clients.claim()])));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(async()=>await caches.match(event.request,{ignoreVary:true})||await caches.match('/index.html',{ignoreVary:true})||await caches.match('/offline.html',{ignoreVary:true})));
    return;
  }
  event.respondWith(caches.match(event.request,{ignoreVary:true}).then(cached=>cached||fetch(event.request).then(response=>{if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()));return response})));
});`;
await writeFile(join(root, 'sw.js'), sw);

const index = await readFile(join(root, 'index.html'), 'utf8');
if (!index.includes('manifest.webmanifest')) throw new Error('Built index is missing its web app manifest');
console.log(`Generated service worker ${CACHE_LABEL(signature)} with ${files.length} precached files`);
function CACHE_LABEL(value) { return `bike-timeline-${value}`; }
