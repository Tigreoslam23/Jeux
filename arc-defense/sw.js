'use strict';
const VERSION='9.63.7';
const BASE=new URL('./',self.location.href);
const PREFIX='arc-defense:'+BASE.pathname+':';
const CACHE=PREFIX+VERSION;
const FILES=['./','index.html','pwa.js','progress.js','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const responses=await Promise.all(FILES.map(async file=>{const url=new URL(file,BASE).href,response=await fetch(new Request(url,{cache:'reload'}));if(!response.ok||response.type==='opaque')throw Error('Incomplete offline download');return [url,response]}));
 const cache=await caches.open(CACHE);await Promise.all(responses.map(([url,response])=>cache.put(url,response)));
 // Updated workers wait until every open game explicitly permits activation.
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith(PREFIX)&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 if(request.mode==='navigate'){
  // One consistent cached release, including when offline or using game query parameters.
  if(url.pathname!==BASE.pathname&&url.pathname!==new URL('index.html',BASE).pathname)return;
  event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(new URL('index.html',BASE).href)||fetch(request)})());return;
 }
 if(FILES.some(file=>new URL(file,BASE).pathname===url.pathname))event.respondWith((async()=>{const cache=await caches.open(CACHE);return await cache.match(url.href,{ignoreSearch:true})||fetch(request)})());
});
let activating=false;
function askClient(client){return new Promise(resolve=>{const channel=new MessageChannel(),timer=setTimeout(()=>resolve(false),2200);channel.port1.onmessage=event=>{clearTimeout(timer);channel.port1.close();resolve(event.data?.safe===true)};client.postMessage({type:'ARC_PREPARE_UPDATE'},[channel.port2])})}
self.addEventListener('message',event=>{
 if(event.data?.type==='ARC_STATUS'){event.ports[0]?.postMessage({version:VERSION,offline:true});return}
 if(event.data?.type!=='ARC_APPLY_UPDATE'||activating)return;
 event.waitUntil((async()=>{activating=true;const clients=(await self.clients.matchAll({type:'window',includeUncontrolled:true})).filter(c=>new URL(c.url).pathname.startsWith(BASE.pathname));
  const answers=await Promise.all(clients.map(askClient));
  if(answers.every(Boolean))await self.skipWaiting();
  else{for(const client of clients)client.postMessage({type:'ARC_UPDATE_BLOCKED'});activating=false}
 })());
});


