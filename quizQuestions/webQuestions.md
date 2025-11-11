# Web Interview Questions — Quick Revision

---

### 1) Explain different types of Storage in browser? (Session, Cookie, Local, IndexedDb)

- **LocalStorage**
  - Persistent key-value store (5–10MB).
  - Synchronous API → avoid for large writes.
  - Use for lightweight user prefs (`theme`, `language`).
  - Data persists across tabs & sessions.

- **SessionStorage**
  - Same API as LocalStorage.
  - Data cleared on tab close.
  - Great for temporary in-memory-like state, e.g., multi-step form progress.

- **Cookies**
  - 4KB limit, sent automatically with every HTTP request.
  - Has expiration, secure, and HttpOnly flags.
  - Used for **authentication/session tokens**.
  - Less performant for large data since it increases request payload.

- **IndexedDB**
  - Asynchronous, NoSQL-like DB in browser.
  - Ideal for **offline caching**, **complex structured data**, or **PWA** use cases.
  - Works with Service Workers to store responses offline.

---

### 2) Explain what is a Service Worker and how does it help?

- A **Service Worker** is a **background thread** that intercepts network requests, enabling **offline support**, **push notifications**, and **caching**.
- Runs separately from main JS thread (non-blocking).
- Works via a **lifecycle**: `install → activate → fetch`.
- You can cache resources in the `install` phase and serve from cache in `fetch`.
- Example:
  ```js
  self.addEventListener('fetch', e =>
    e.respondWith(caches.match(e.request) || fetch(e.request))
  );
  ```
- Core use cases:
  - Offline fallback pages.
  - Cache versioning and stale-while-revalidate patterns.
  - Background sync for pending requests.

---

### 3) How would you implement Offline support in a web app?

- Use **Service Workers** + **Cache API** to serve assets when offline.  
- Store API responses in **IndexedDB** for structured offline data.
- Implement a **sync queue** using Background Sync API to replay requests when online.
- Add an **"offline mode" banner** or **graceful fallback UI**.
- Example strategy:
  - `install`: cache static assets (`index.html`, CSS, JS).
  - `fetch`: respond from cache; fallback to network.
  - On reconnect, sync missed POST requests.

---

### 4) Explain 5 Core Web Vitals with detailed example

- **LCP (Largest Contentful Paint)** → Measures loading speed.
  - Target: < 2.5s
  - Optimize: Compress hero images, use lazy loading for below-fold images.

- **FID (First Input Delay)** → Measures input responsiveness.
  - Target: < 100ms
  - Optimize: Minimize main-thread blocking (split long JS tasks).

- **CLS (Cumulative Layout Shift)** → Visual stability metric.
  - Target: < 0.1
  - Optimize: Reserve layout space for ads/images, use `aspect-ratio`.

- **FCP (First Contentful Paint)** → First paint of content.
  - Optimize: Inline critical CSS, reduce render-blocking JS.

- **TTFB (Time To First Byte)** → Backend/server latency.
  - Optimize: Use CDN, caching headers, server compression.

---

### 5) Explain how would you implement Accessibility (a11y) in a Website?

- Use **semantic HTML** — screen readers interpret `<button>`, `<nav>`, `<header>` directly.
- Add **ARIA roles** only when native semantics aren’t available.
- Maintain **keyboard accessibility** — `tabIndex`, focus states, skip links.
- Ensure **contrast ratios**, **alt text**, and **form labels**.
- Use tools like **axe**, **Lighthouse**, or **Wave** for audits.
- Example:
  ```html
  <button aria-label="Close modal" onClick={handleClose}>✖</button>
  ```

---

### 6) Explain how would you optimise bundle size and assets?

- **Code splitting** with dynamic `import()` or React.lazy().
- **Tree shaking** unused exports via ES module static analysis.
- Use **Brotli/Gzip compression**.
- **Optimize images** → WebP, responsive images via `srcset`.
- Use **Webpack Bundle Analyzer** to visualize large deps.
- **CDN caching** and **immutable asset versioning** with `[contenthash]`.

---

### 7) How would you optimise LCP, FCP, TTFB, TTI, CLS?

- **LCP** → Optimize hero image loading, compress assets, inline critical CSS.
- **FCP** → Reduce render-blocking CSS/JS, preload key resources.
- **TTFB** → Use edge caching, CDN, and server compression.
- **TTI** → Split large JS bundles, defer non-critical scripts.
- **CLS** → Add placeholders, set explicit height/width for images and ads.

---

### 8) What is Webpack? Explain Webpack-level optimisations for a Web app and how do they work internally?

- **Webpack** is a **module bundler** that builds a dependency graph and outputs optimized bundles.
- Internal working:
  - Parses imports to build dependency graph.
  - Transforms via **loaders** (e.g., babel-loader, css-loader).
  - Optimizes with **plugins** (minification, chunking).
- Optimizations:
  - **Tree shaking** for unused exports.
  - **Code splitting** with multiple entry points.
  - **Caching** with `[contenthash]`.
  - **Scope hoisting** and **lazy loading**.
- Use **production mode** for minified, optimized builds.

---

### 9) What is code splitting and how does Webpack generate chunks?

- **Code splitting** divides JS bundles into smaller chunks loaded on demand.
- Webpack creates async chunks from **dynamic imports** or **split points**.
- Reduces initial load time and improves **TTI**.
- Example:
  ```js
  const Dashboard = React.lazy(() => import('./Dashboard'));
  ```
- Internally, Webpack creates separate files for each import and loads them via runtime manifest.

---

### 10) How does Webpack tree-shaking work internally?

- Works only with **ES Modules** because of **static import/export analysis**.
- Webpack marks unused exports as `/* unused harmony export */`.
- **Terser** removes dead code during minification.
- Requires `sideEffects: false` in `package.json` for purity.

---

### 11) How would you test for memory leaks in a frontend app?

- Use **Chrome DevTools → Memory tab** to take heap snapshots.
- Look for **detached DOM nodes**, **event listeners** not cleaned up, or **closures retaining state**.
- Example in React:
  ```js
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  ```
- Automate memory profiling using Puppeteer or Lighthouse CI.

---

### 12) How do ARIA roles work, and when should they be used?

- **ARIA roles** bridge semantic gaps for custom elements (div-based UIs).
- Used only when semantic elements are not sufficient.
- Example:
  ```html
  <div role="button" tabindex="0">Click</div>
  ```
- ARIA roles inform screen readers about intended behavior and interaction patterns.

---

### 13) What is the difference between semantic HTML and ARIA labels?

- **Semantic HTML** provides built-in meaning and accessibility (e.g., `<header>`, `<button>`).
- **ARIA** supplements semantics when native tags can't express intent.
- Always prefer **semantic HTML first**, fallback to ARIA only when required.

---

### 14) Explain preload, prefetch in a Web app?

- **Preload**: Fetches critical assets **needed immediately** for current navigation.
  ```html
  <link rel="preload" href="/main.css" as="style" />
  ```
- **Prefetch**: Downloads **likely future assets** during idle time for next navigation.
  ```html
  <link rel="prefetch" href="/next.js" />
  ```
- Improves perceived performance and TTI.

---

### 15) Explain CSS specificity calculation rules?

- Hierarchy:
  - Inline (1000)
  - ID (100)
  - Class/attribute/pseudo-class (10)
  - Element/pseudo-element (1)
- Example: `#id .btn.active` → 100 + 10 + 10 = 120
- Use consistent **naming conventions (BEM)** to avoid specificity wars.

---

### 16) What causes layout thrashing and how to prevent it?

- Happens when JS alternates between **DOM reads** and **writes**, forcing reflows.
- Example:
  ```js
  el.style.height = "200px";
  console.log(el.offsetHeight); // forces layout
  ```
- Prevention:
  - Batch DOM reads/writes.
  - Use `requestAnimationFrame`.
  - Use `transform` instead of layout-affecting properties (like `top`/`left`).

---

### 17) How do browsers prioritize resource loading (critical path rendering)?

- Browser builds:
  - **DOM** from HTML.
  - **CSSOM** from CSS.
  - Combines to form **Render Tree**.
- JS can block DOM construction; CSS blocks rendering.
- Optimization:
  - Inline critical CSS.
  - Defer or async JS.
  - Preload above-fold resources.

---

### 18) How does lazy loading of scripts differ from defer and async?

- **Async**: Downloads in parallel, executes **immediately** (may block rendering).
- **Defer**: Downloads in parallel, executes **after DOM parsing**.
- **Lazy loading**: Loads scripts **on-demand** using dynamic `import()` or based on visibility (via IntersectionObserver).
- Example:
  ```js
  if (inView) import('./Chart.js');
  ```

---

### 19) Explain how caching headers (Cache-Control, ETag) affect frontend performance?

- **Cache-Control**
  - Defines how and how long a browser should cache a resource.
  - `max-age=31536000, immutable` → long-term immutable assets.
- **ETag**
  - A unique identifier (hash) for resource versioning.
  - Enables conditional requests → re-download only if changed.
- **Effect:** Faster load, fewer network calls, improved TTFB.

---