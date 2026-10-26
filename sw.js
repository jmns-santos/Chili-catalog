/* CATÁLOGO CHILI · funcionamento sem rede.
   Rede primeiro (o site está sempre atualizado quando há ligação); sem rede, usa a última cópia guardada.
   Só guarda ficheiros deste site; a comunidade online (Supabase) nunca passa por aqui. */
const CACHE = 'cc-v9';
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  /* a página guarda-se sempre com o endereço limpo (sem ?code= nem outros parâmetros da entrada por email) */
  const home = new URL('./', self.registration.scope).href;
  const key = r.mode === 'navigate' ? home : r;
  e.respondWith(fetch(r).then(res => {
    if (res.ok && res.type === 'basic'){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(key, copy)).catch(() => {}); }
    return res;
  }).catch(() => (r.mode === 'navigate' ? caches.match(home) : caches.match(r, {ignoreSearch: false}).then(m => m || caches.match(r, {ignoreSearch: true}))).then(m => m || Response.error())));
});
