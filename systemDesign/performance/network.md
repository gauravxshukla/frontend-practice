## Network Optimizations: Preload, Prefetch, and Reducing API Calls

### Resource Hints: Preload vs Prefetch (and more)
- **preload**: High-priority fetch for resources needed in the current navigation. Guarantees early download and correct priority.
```
<link rel="preload" as="style" href="/styles.css" />
<link rel="preload" as="font" href="/fonts/inter.woff2" type="font/woff2" crossorigin>
```
- **prefetch**: Low-priority fetch for resources likely needed for future navigations (next page/code-split chunk). May be dropped on slow networks.
```
<link rel="prefetch" href="/next-route-chunk.js" as="script">
```
- **preconnect**: Establish TCP/TLS handshake early to third-party origins to reduce connection setup latency.
```
<link rel="preconnect" href="https://api.example.com" crossorigin>
```
- **dns-prefetch**: Resolve DNS early (lighter than preconnect). Use when you can’t or don’t need full handshake yet.
```
<link rel="dns-prefetch" href="//cdn.example.com">
```
- **priorities and correctness**:
  - Use `preload` only for critical resources you are certain will be used.
  - Use `prefetch` for likely-next; pair with user interaction signals.
  - Prefer `preconnect` over `dns-prefetch` when TLS is expected and origins are few.
  - Avoid over-hinting; excessive hints can compete with critical resources.

### HTTP Caching and Headers
- **Caching directives**: `Cache-Control: public, max-age=31536000, immutable` for fingerprinted assets.
- **Validation**: `ETag`/`If-None-Match`, `Last-Modified` for conditional requests.
- **Vary** wisely: `Vary: Accept-Encoding, Accept-Language` when needed.
- **Compression**: Enable Brotli (br) and Gzip. Prefer Brotli for HTTPS.

### Service Workers: Fewer Network Roundtrips
- **Capabilities**: Offline caching, request interception, background sync, push.
- **Strategies** (match the resource type):
  - Static assets: Cache-first with versioned cache names.
  - API data: Stale-while-revalidate or network-first with timeout fallback.
  - Images: Cache-first with runtime limits (LRU) and `Cache-Control` respect.
```
// sw.js (minimal illustration)
const STATIC_CACHE = 'static-v1';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(['/','/styles.css','/app.js'])));
});
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api/')) {
    e.respondWith((async () => {
      const cache = await caches.open('api');
      const cached = await cache.match(e.request);
      const network = fetch(e.request).then((res) => { cache.put(e.request, res.clone()); return res; });
      return cached || network; // stale-while-revalidate
    })());
  }
});
```
- **Background Sync**: Queue writes offline; replay when connectivity returns.
- **Workbox**: Prefer `workbox` for robust strategies, routing, and precaching.

### React Query (TanStack Query): Cut Duplicate Calls
- **Request deduplication**: Identical queries in-flight are coalesced.
- **Caching with TTL**: `staleTime` avoids refetching for a time window.
- **Cache scoping**: Keys represent data shape; use params in keys.
- **Prefetching**: Warm cache on navigation/hover; SSR or router loaders.
- **Background refetch**: Keep data fresh without blocking UI.
```
// Example: avoid refetch for 5 minutes and prefetch on hover
const queryClient = new QueryClient();
function useUser(userId) {
  return useQuery({ queryKey: ['user', userId], queryFn: () => fetchUser(userId), staleTime: 5 * 60 * 1000 });
}
// prefetch before navigation
queryClient.prefetchQuery({ queryKey: ['user', id], queryFn: () => fetchUser(id) });
```
- **Optimistic updates**: Reduce perceived latency for writes; rollback on error.
- **Garbage collection**: Tune `cacheTime` to balance memory vs re-fetches.

### Local Storage, IndexedDB, and App Storage Strategy
- **When to use**:
  - `localStorage/sessionStorage`: Small key-value settings; synchronous API, block main thread; avoid for large data.
  - `IndexedDB` (or wrappers like `idb`, `dexie`): Larger structured caches, offline datasets.
  - `Cache Storage` (via Service Worker): Response objects for GETs, ideal for HTTP-like caching.
- **Patterns to reduce API usage**:
  - Read-through cache: Check storage first; fetch and populate on miss.
  - Versioned schemas: Bump version to invalidate incompatible data.
  - Hybrid: React Query as in-memory L1; IndexedDB/Cache Storage as L2.
```
// IndexedDB + Query example sketch (dexie-like pseudo)
const db = new Dexie('app'); db.version(1).stores({ users: 'id,updatedAt' });
async function getUserCached(id) {
  const cached = await db.users.get(id);
  if (cached && Date.now() - cached.updatedAt < 300000) return cached; // 5 min TTL
  const fresh = await fetchUser(id); await db.users.put({ ...fresh, updatedAt: Date.now() }); return fresh;
}
```

### Putting It Together: Navigation Flow
- On route hover: `prefetch` code/data for likely next view.
- On navigation start: `preload` critical CSS/font; `preconnect` to APIs.
- At runtime: React Query serves cached data (stale) instantly; SW updates in background.
- Offline: SW serves from Cache/IndexedDB; background sync for queued writes.

### Guardrails
- Measure with the Performance panel and WebPageTest; verify priorities (Priority Hints, `fetchpriority`).
- Avoid hint overload; ensure critical path CSS/JS aren’t starved.
- Respect HTTP caching headers; don’t fight browser cache heuristics.
- Secure origins (HTTPS) to unlock Brotli, HTTP/2+, and Service Worker features.
