## JavaScript Bundle Optimization

### Bundle splitting
- **Why**: Reduce initial JS download/parse/execute, improve Time to Interactive by loading only what’s needed first.
- **How**:
  - **Entry-based splitting**: Multiple entry points for distinct pages/apps.
  - **Route-based splitting**: Load each route’s JS separately.
    ```js
    // React example
    const Page = React.lazy(() => import('./pages/Page'));
    ```
  - **Vendor splitting**: Isolate large, infrequently changing deps (e.g., `react`, `lodash`).
  - **Common-chunk splitting**: Extract shared code used by many chunks.
  - **Granular library imports**: Prefer `lodash-es/map` or named imports over whole lib.
- **Caveats**: Too many tiny chunks increase requests/overhead; balance with HTTP/2/3 and caching.

### Compressing JS
- **Minification vs compression**:
  - Minify at build (remove whitespace, rename symbols).
  - Compress at serve time (e.g., Brotli, Gzip).
- **Recommendations**:
  - Enable **Brotli** (`br`) with `gzip` fallback; precompress static assets during CI.
  - Serve proper headers: `Content-Encoding`, `Content-Type: application/javascript`, `Cache-Control` with long max-age + immutable for hashed filenames.
  - Keep source maps separate; don’t ship inline.
- **Trade-offs**: Brotli level 11 yields best size but costs CPU; precompress static assets to avoid per-request cost.

### Dynamic import
- **What**: `import()` returns a Promise and creates an async chunk.
  ```js
  async function loadChart() {
    const { Chart } = await import('./Chart');
    new Chart().render();
  }
  ```
- **Hints**: Use prefetch/preload when appropriate.
  ```js
  // webpack magic comments
  import(/* webpackPrefetch: true */ './HeavyWidget');
  import(/* webpackPreload: true */ './AboveTheFold');
  ```
- **SSR**: Ensure fallbacks for server rendering or use framework helpers (e.g., Next.js `next/dynamic`).

### Tree shaking
- **Goal**: Remove unused exports at build time.
- **Requirements**:
  - Use **ESM** (static `import/export`) instead of CommonJS.
  - Avoid dynamic property access that hides side effects.
  - Mark packages as side-effect-free when true (`package.json` `sideEffects: false`).
- **Pitfalls**:
  - Side-effectful modules cannot be shaken safely.
  - Re-export barrels can block tree shaking if they hide usage.
- **Verify**: Inspect final bundles and enable compiler warnings/bundle analyzers.

### Import on interaction (idle/hover/click)
- **Pattern**: Delay loading code until user intent is clear.
  ```js
  button.addEventListener('click', async () => {
    const { openModal } = await import('./modal');
    openModal();
  });
  ```
- **Enhancements**:
  - Preload on `mouseover` to hide latency when user is likely to click.
  - Use `requestIdleCallback` to warm caches when the main thread is idle.

### Import on visibility (viewport-based)
- **Pattern**: Load code when the element becomes visible using `IntersectionObserver`.
  ```js
  const el = document.querySelector('#chart');
  const observer = new IntersectionObserver(async ([entry], obs) => {
    if (!entry.isIntersecting) return;
    const { renderChart } = await import('./chart');
    renderChart(el);
    obs.disconnect();
  }, { rootMargin: '200px' });
  observer.observe(el);
  ```
- **Use cases**: Below-the-fold widgets, carousels, analytics visualizations.

### Measuring and validating
- **Bundle analyzer**: Visualize chunk sizes and duplication.
- **Coverage**: Use DevTools Coverage to find unused code.
- **Perf budgets**: Set KB limits per route/chunk in CI.
- **RUM**: Track JS metrics (First Input Delay/INP, TBT, TTI) after changes.

### Practical checklist
- **Split by route and critical UI boundaries**; keep initial chunk lean.
- **Prefer ESM, named imports, and side-effect-free modules** for tree shaking.
- **Adopt dynamic `import()`** for non-critical and rare paths.
- **Use import-on-interaction/visibility** to defer heavy widgets.
- **Precompress with Brotli**, serve with long-term caching and immutable hashed filenames.
- **Continuously measure** with analyzers, coverage, and performance budgets.

### Loading sequence
- **Goals**: Prioritize above-the-fold render, interactivity of critical UI, and defer everything else.
- **Order of operations (typical SPA/MPA)**:
  1) Critical HTML + critical CSS (inline small CSS or use `rel=preload` for main CSS).
  2) Critical JS for shell/hydration loaded with `defer` or as ESM module.
  3) Route-level chunks for current view.
  4) Non-blocking assets: images with lazy/`fetchpriority`, fonts with `preload`.
  5) Future-route prefetching during idle.
- **Script loading**:
  - `defer`: Executes after HTML parse, preserves order; best default for classic scripts.
  - `async`: Executes ASAP, order not guaranteed; good for analytics.
  - `type="module"`: Modules are deferred by default; supports `modulepreload`.
  - `nomodule`: Fallback for legacy browsers when shipping dual builds.
  ```html
  <script src="/app.legacy.js" nomodule></script>
  <script type="module" src="/app.modern.js"></script>
  ```
- **Resource hints and priorities**:
  - `preload`: For assets needed during initial render (fonts, hero image, main CSS/JS chunk).
  - `modulepreload`: Preload ESM graph dependencies discovered late by the browser.
  - `prefetch`: Low-priority fetch for future navigations.
  - `fetchpriority`: Hint browser priority for images/iframes (`high|low|auto`).
  ```html
  <link rel="preload" as="style" href="/styles.css" />
  <link rel="modulepreload" href="/chunks/vendor.mod.js" />
  <link rel="prefetch" href="/chunks/settings.mod.js" />
  <img src="/hero.jpg" fetchpriority="high" />
  ```
- **CSS strategy**:
  - Inline tiny critical CSS; load the rest with a non-blocking stylesheet swap.
  ```html
  <link rel="preload" as="style" href="/styles.css" />
  <link rel="stylesheet" href="/styles.css" media="print" onload="this.media='all'" />
  ```
- **Images and fonts**:
  - Use `loading="lazy"` for below-the-fold images.
  - Preload above-the-fold fonts with `crossorigin` and proper `font-display`.
  ```html
  <link rel="preload" as="font" href="/fonts/Inter.woff2" type="font/woff2" crossorigin>
  <img src="/below-the-fold.jpg" loading="lazy" />
  ```
- **Server cooperation**:
  - Send Early Hints (103) or `Link` headers for `preload/modulepreload`.
  - Use long-term caching with hashed filenames; avoid blocking redirects.
  ```
  Link: </styles.css>; rel=preload; as=style, </app.modern.js>; rel=modulepreload
  ```
- **Runtime sequencing examples**:
  - Preload likely next-route chunk on idle.
    ```js
    requestIdleCallback(() => {
      import(/* webpackPrefetch: true */ './routes/Settings');
    });
    ```
  - Defer heavy widgets to visibility/interaction as above.


