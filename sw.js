/* OpsField offline read-only cache. Keep cache name versioned when release changes. */
const CACHE="opsfield-v2-20261012";
const ASSETS=["./","./index.html","./ops-style.css","./ops-data.js","./ops-app.js","./icon.svg","./manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("opsfield-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
 const req=e.request;if(req.method!=="GET"||new URL(req.url).origin!==self.location.origin)return;
 e.respondWith(fetch(req).then(res=>{
   if(res.ok){const cloned=res.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(req,cloned)).catch(()=>{}));}
   return res;
 }).catch(()=>caches.match(req).then(cached=>cached||caches.match("./index.html"))));
});