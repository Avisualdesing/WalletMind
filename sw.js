const V = "walletmind-v1";
const BASE = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(V).then((c) => c.addAll(BASE))); self.skipWaiting(); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== V).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const r = e.request; if (r.method !== "GET") return;
  if (r.mode === "navigate") { e.respondWith(fetch(r).then((res) => { const cp = res.clone(); caches.open(V).then((c) => c.put("index.html", cp)); return res; }).catch(() => caches.match("index.html"))); return; }
  e.respondWith(caches.match(r).then((m) => m || fetch(r).then((res) => { const u = new URL(r.url); if (res.ok && (u.origin === location.origin || /fonts\.(googleapis|gstatic)\.com$/.test(u.hostname))) { const cp = res.clone(); caches.open(V).then((c) => c.put(r, cp)); } return res; })));
});
