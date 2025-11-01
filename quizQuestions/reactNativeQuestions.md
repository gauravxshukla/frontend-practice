# React Native Interview Questions — Answers (Updated, without Deep Linking)

---

### 1) Difference between FlatList and ScrollView? Which to use and when?

### Difference Between ScrollView and FlatList (Senior React Native)

#### **ScrollView**
- Renders **all child components at once** (no virtualization)
- Best for **small, static, and bounded content**
- Ideal for **mixed UI layouts** — forms, banners, settings pages
- Smooth initial paint but **not scalable for large lists**

**Why ScrollView can cause issues on large lists**
- All items stay mounted in JS + Native memory  
  → **High RAM usage** ❌  
- Large component tree = heavy rendering & layout work  
  → **Dropped frames / lag** ❌  
- Low-end Android devices can't handle large memory blocks  
  → **App crash / OOM errors** ❌  

**Use ScrollView for**
- Profile page  
- Settings / Forms / About page  

---

#### **FlatList / SectionList**
- **Virtualized list** — renders **only visible items + buffer**
- Ideal for **large, long, or dynamic lists**
- Scales to **hundreds / thousands of items**
- Recycles list rows for **efficient memory usage**

---

### ✅ **FlatList Key Capabilities**

| Capability | Explanation |
|----------|------------|
`data`, `renderItem`, `keyExtractor` | Data-driven list, UI per item, stable keys for reconciliation |
Infinite scroll → `onEndReached` | Load more items when reaching bottom (pagination) |
Pull-to-refresh → `refreshing`, `onRefresh` | Native pull down gesture to refresh list |
Scroll to index → `scrollToIndex` | Jump to specific item (chat "jump to latest", etc.) |
Chat support → `inverted`, `maintainVisibleContentPosition` | Messages from bottom, avoid scroll jump when new messages arrive |
Memoized items (`React.memo`, `useCallback`) | Prevents unnecessary re-renders of list rows |

---

### 🚀 **FlatList Performance Features**

| Feature | Purpose |
|--------|--------|
`windowSize` | Controls how many screens worth of items are rendered |
`maxToRenderPerBatch` | Limits batch size to avoid blocking UI thread |
`getItemLayout` | Skip measuring — improve scroll & `scrollToIndex` for fixed-height rows |
`removeClippedSubviews` | Removes off-screen views to save memory (Android benefit) |
Cell Recycling + Incremental Rendering | Reuses row components + renders gradually → smooth scroll, low memory footprint |

---

### ✅ When to Use
- **ScrollView** → small, static content  
- **FlatList** → large or dynamic data, infinite scrolling, chat UI, lists from API

---

### 🎯 Example
- **ScrollView:** Profile/Settings screen (finite sections and UI blocks)  
- **FlatList:** Chat or Transaction History (large, paginated data)


---

### 2) How many threads does React Native have? Explain them.

React Native primarily operates across **three core threads**, with additional native background threads supporting system tasks. Understanding these is crucial for performance and architecture decisions.

---

### ✅ **1. UI / Main Thread**
- Handles **native UI rendering & updates**
- Manages **touch/gesture events**
- Executes **layout & view mounting** (final UI commit)
- On iOS, interacts with UIKit; on Android, handles View operations

**If blocked**
- UI freezes, dropped frames, ANRs, laggy gestures

**Why it matters**
- Heavy computations or synchronous native calls here will freeze UI
- Native-driver animations avoid JS involvement to stay smooth

---

### ✅ **2. JavaScript Thread**
- Runs application **JavaScript code**
- Executes **React reconciliation**, state updates, hooks, components
- Coordinates native calls (Bridge in old RN, JSI in Fabric)
- Handles timers, logic, event responses

**If blocked**
- Touch delay, timer drift, delayed re-renders, janky interactions

**Why it matters**
- Avoid long loops, heavy JSON parsing, and sync storage calls in JS

---

### ✅ **3. Shadow Thread (Layout Thread)**
- Runs **Yoga** flexbox layout engine
- Builds the **Shadow Tree** (virtual layout tree)
- Computes size & position of views
- In **Fabric**, uses C++ core to compute layout and diff

**If overloaded**
- Layout delays, visible snapping, UI updating late

**Why it matters**
- Deep nested views or frequent layout changes can stress this thread

---

### ⚙️ **Additional Supporting Native Threads**

| Thread | Purpose |
|--------|--------|
Networking Threads | Handles XHR, fetch, uploads/downloads |
Image Decode Threads | Image decoding, resizing, caching |
File I/O Threads | Async storage + filesystem access |
Hermes GC Thread | Garbage collection for JS runtime |
Android RenderThread | GPU-side rendering pipeline |

These threads operate asynchronously to keep JS + UI responsive.

---

### 🏗️ **Architecture Context**
React Native's threading model is consistent across architectures, but communication changed:

#### **Old Architecture (Bridge)**
- JS sends batched messages → Native
- Overhead due to JSON serialization and async bridge

#### **New Architecture (Fabric + JSI + TurboModules)**
- JS calls native directly via **JSI**
- C++ **Fabric core** manages layout & mounting
- Faster UI updates, less serialization overhead, better prioritization

**Key takeaway:** Threads remain the same, but **Fabric improves how JS and native talk**, reducing bottlenecks and improving responsiveness.


---

### 3) What is Hermes? Why is it used?

**Hermes** is a lightweight, mobile-optimized JavaScript engine built specifically for **React Native**.  
Its design focuses on improving **startup time, memory usage, and overall performance** for mobile apps.

### ✅ Why Hermes is used in React Native

| Benefit | Explanation |
|--------|------------|
📱 Mobile-first design | Tailored for resource-constrained devices (Android & iOS) |
⚡ Faster startup time | Avoids parsing & compiling large JS bundles at runtime |
🧠 Lower memory usage | Compact bytecode, efficient garbage collector |
🔧 Better debugging | Native integration with Flipper, source maps, profiling |
🚀 Designed for RN new architecture | Works natively with **JSI, Fabric, TurboModules** |

Hermes reduces **Time-to-Interactive (TTI)** and stabilizes performance across low-end and mid-range devices.


# Hermes uses **AOT (Ahead-Of-Time) compilation insted of JIT (Just - In - Time )** - 

- Your JavaScript is compiled to **Hermes bytecode (.hbc)** **at build time**
- The app loads this bytecode directly → **no parsing or compiling during app startup**
- Hermes **interprets bytecode** efficiently and uses a **mobile-friendly GC**

**Effect:**  
> Faster cold start, predictable performance, and lower runtime memory usage.

This contrasts with engines that wait until **runtime** to compile code, causing slower app launch.

---

### ✅ Bundled vs Static Hermes

#### **Bundled Hermes**
- JS is **precompiled into bytecode (.hbc)** during the build
- Bytecode ships with the app bundle
- At startup, Hermes **directly executes** bytecode

**Pros**
- Fastest startup time
- Lower runtime overhead

_Default & recommended mode for production RN apps._

---

#### **Static Hermes**
- Hermes engine is **statically linked** into the app binary instead of loaded as a shared library
- Primarily a **build/link configuration optimization**

**Pros**
- Can reduce dynamic linking overhead
- Allows native linker to strip unused symbols
- Potentially smaller memory footprint + faster load on some builds

_Used in optimized & custom native pipelines._

---

### 📌 Summary

- Hermes is a **mobile-friendly JS engine** for React Native
- Uses **AOT bytecode** → faster startup, lower memory vs runtime compilation
- Works tightly with **Fabric, JSI, TurboModules**
- Supports **bytecode bundling** and **static linking**
- Recommended default for modern RN apps

---

### 4) Explain React Native Bridge in the Old Architecture?

In the **old React Native architecture**, the **Bridge** is the communication layer that connects the **JavaScript realm** (running app logic and React rendering) with the **Native realm** (UIViews on iOS, Views on Android, native modules). It is:

- **Asynchronous**
- **Batched**
- **JSON-serialized**

This design allowed RN to be platform-agnostic and sandbox JS from native details, but it introduced overhead and latency in chatty scenarios.

---

## 🏗️ How the Bridge Works (Step-by-step)

1. **JS render/reconcile**  
   React (on the **JS thread**) computes a diff of UI changes from your components.

2. **Queue & serialize**  
   Those commands (e.g., “create view”, “update prop”, “dispatch command”, “invoke native method”) are **batched into a queue** and **JSON-serialized**.

3. **Cross the Bridge**  
   The batch is sent across the **Bridge** to the native side **asynchronously**.

4. **Native deserialize & dispatch**  
   Native receives the JSON batch, **deserializes** it, and dispatches:
   - View mutations to **UIManager** (ultimately **Main/UI thread**)
   - Module calls to the appropriate **Native Module** (often on background/native queues)

5. **UI commit**  
   Native applies mutations to the real view hierarchy (layout, mount/unmount, prop updates) on the **UI/Main thread**.

6. **Callbacks / events back to JS**  
   If a native call returns a value or emits an event, it goes **back across the Bridge** as **another async message** (callbacks, promises, `DeviceEventEmitter`).

> The Bridge is **one-way per message** and **asynchronous**. JS can’t read native state synchronously (without hacks). Every round-trip costs time and serialization work.

---

## 🧩 Message Types Over the Bridge

- **View operations**: create/update/remove view, set props, measure, dispatch commands
- **Native module calls**: e.g., Geolocation, Camera, Share, AsyncStorage, custom modules
- **Events**: touch/gesture events, scroll, keyboard, app state; emitted back to JS
- **Callbacks/Promises**: native result → JS resolution via another async message

---

## 🧵 Threading Model (Old Arch)

- **JS Thread**: React reconciliation, business logic, creates the “instructions”
- **Shadow/Layout Thread**: Yoga computes layout from the shadow tree (varied over RN versions)
- **UI/Main Thread**: Applies UI mutations, handles gestures/paint scheduling
- **Background Native Threads**: Networking, image decode, file I/O, etc.

All **JS↔Native** coordination goes through the **Bridge queues**.

---

## ⚠️ Limitations & Why They Matter

1. **Asynchronous, single communication channel**
   - No **sync reads** from native → complex flows become multi-round-trip.
   - **Back-pressure** when JS or native is busy (queues grow).

2. **JSON serialization/deserialization overhead**
   - Large or frequent payloads (e.g., passing big arrays, frames of data) incur **CPU + memory churn** on both sides.

3. **Latency for high-frequency interactions**
   - **Animations**, **gestures**, **scroll events**, and **per-frame updates** become janky if they cross the Bridge every frame.
   - Sending 60 fps events across the Bridge is almost always a bottleneck.

4. **Chatty boundaries**
   - Pixel-by-pixel updates from JS to native (or vice versa) are pathological under the old Bridge.

**Symptoms in production**
- Missed frames, scroll jank, delayed touches
- “Rubber-banding” feel on gestures
- Timer drift on JS side when queues are congested


## 🛠️ Patterns to Reduce Bridge Cost (Old Arch)

- **Batch work**: fewer, larger messages > many tiny messages.
- **Push heavy work native-side**: e.g., image processing, media, crypto.

---

### 5) What is New Architecture? Explain its benefits over Old Architecture

The **New Architecture** modernizes React Native by replacing the legacy Bridge system with:

- **JSI (JavaScript Interface)**
- **Fabric Renderer**
- **TurboModules**
- **Codegen**
- **Hermes Engine**

This enables **direct JS ↔ Native access**, faster UI rendering, type‑safe modules, and improved performance.

---

## 🆚 Old Architecture vs New

| Old Architecture (Bridge) | New Architecture (Fabric + JSI) |
|---|---|
Async JSON Bridge | Direct C++ calls via JSI |
Serialization overhead | No serialization |
Async only | Sync + async native calls |
Manual bridging code | Auto‑generated via Codegen |
UIManager controls UI | Fabric Shadow Tree + Mounting |
Event lag under load | Low‑latency event pipeline |

**Outcome:** Lower latency, smooth UI, more native‑like performance, type safety, scalability.

---

## 🧱 Building Blocks

### **1) JSI**
- C++ layer exposing native functionality to JavaScript
- Eliminates JSON/bridge
- Allows calling native methods directly like JS functions

### **2) TurboModules**
- New native module system
- Lazy loaded
- Faster calls via JSI
- Strong typing using Codegen

### **3) Fabric Renderer**
- New UI system replacing UIManager
- Uses:
  - **C++ Shadow Tree** (virtual UI tree)
  - **Yoga layout engine**
  - **Mounting layer** for UI updates

### **4) Codegen**
- Reads TypeScript/Flow component & module definitions
- Generates binding code JS ↔ Native + C++

### **5) Hermes**
- Mobile optimized JS engine
- AOT bytecode → fast startup + low memory
- Deep integration with JSI/Fabric

---

## 🧠 How They Work Together

```
        JavaScript (Hermes)
                |
               JSI
                |
     +----------+-----------+
     |                      |
TurboModules           Fabric Renderer
(Native modules)       (Shadow Tree + Yoga)
                            |
                        Mounting Layer
                            |
                       UI / Main Thread
```

---

## 🔁 Data & Command Flow

### **JS Rendering UI**
```
JS render request
→ Fabric Scheduler
→ Shadow Tree (C++)
→ Yoga layout (off main)
→ Mounting instructions
→ UI/Main thread paints UI
```

### **JS → Native Module**
```
JS function call
→ JSI binding
→ TurboModule executes native code
→ Optional return value via JSI (sync or async)
```

### **Native → JS Events**
```
Native event
→ C++ event pipeline
→ JSI callback
→ JS listener receives event
```

---

## 🧵 Thread Model

| Thread | Role |
|---|---|
JS Thread | App logic & React reconciliation |
Shadow/Layout Thread | Shadow Tree + Yoga layout |
UI/Main Thread | Final UI updates, gestures |
Native Worker Threads | Networking, I/O, image decode |

---

## 🎯 Summary

The New Architecture:

- Removes the Bridge
- Uses **JSI** for direct JS ↔ Native calls
- Introduces **TurboModules + Codegen**
- Uses **Fabric + Shadow Tree + Mounting**
- Optimized by **Hermes**

> It makes React Native faster, more native‑like, scalable, and production‑ready for large real‑time, animation‑heavy apps.


---

### 7) How to optimize startup time of React Native App?

## 🎯 Goal
Improve **cold start**, **warm start**, **TTFR** (Time To First Render), and **TTI** (Time To Interactive) in a production React Native app.

---

## ✅ 1. Measure First (Profile Startup)
- Define key metrics: App Launch → First Render → First Interaction
- Tools:
  - **Android:** Perfetto, `adb shell am start -W`, Android Studio Profiler
  - **iOS:** Xcode Instruments, Time Profiler, os_signpost markers
  - **JS:** `performance.mark`, @shopify/react-native-performance, Flipper Perf Plugin
- Add startup testing to **CI** for regression alerts

---

## ✅ 2. Enable Hermes & Optimize Metro
### Hermes Benefits
- AOT bytecode → faster cold start
- Lower memory footprint
- Better debugging + performance hooks

### Metro config
Use **inlineRequires** + code splitting:

```js
// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: { inlineRequires: true },
    }),
  },
};
```

---

## ✅ 3. Defer Non‑Critical Work
### JS
- Lazy load screens (`React.lazy`, dynamic import)
- Defer analytics + crash SDK init
- Use `InteractionManager.runAfterInteractions` & `requestIdleCallback`
- Avoid heavy logic in `App.js`

### Native
- Delay Firebase, maps, ads, crash reporters
- Avoid heavy work in `Application` (Android) or `+load` (iOS)

---

## ✅ 4. Keep UI Thread Free
- Show **native splash** instantly
- Keep first render lightweight
- Use skeleton loaders instead of fully built screen
- Offload animations using **Reanimated** or `useNativeDriver`

---

## ✅ 5. Shrink Initial Render Surface
- Avoid loading all providers globally on app start
- Boot with a **Shell UI** (navigation + empty states)
- Hydrate user/session/flags in background after first render

---

## ✅ 6. Navigation & Lists Optimization
- Use `react-native-screens` for native navigation stack
- FlatList settings:
  - Small `initialNumToRender`
  - Provide `getItemLayout`
  - Tune `windowSize` & `maxToRenderPerBatch`

---

## ✅ 7. Reduce Bundle & App Size
- **Android:**
  - R8 + resource shrinking
  - Split APK by ABI
- **iOS:**
  - Strip unused architectures
- Remove dev tools (storybook, Flipper plugins) from prod build
- Compress images / use WebP

---

## ✅ 8. Leverage New Architecture
- **TurboModules**: lazy‑loaded native modules
- **Fabric**: more efficient UI commits than UIManager

---

## ✅ 9. Smart Caching Strategy
- Cache user data + feature flags
- Hydrate screen with cached skeleton first
- Avoid blocking boot on network

---

## ✅ Anti‑Patterns to Avoid
- ❌ Heavy work in `App.tsx`
- ❌ Starting analytics before UI loads
- ❌ Large JSON parsing on startup
- ❌ Rendering complex lists on first screen
- ❌ Too many global Context providers

---

## ✅ TL;DR Startup Checklist
- [ ] Hermes enabled
- [ ] `inlineRequires: true`
- [ ] Lazy load modules & screens
- [ ] Lightweight shell screen + skeleton UI
- [ ] Defer non‑critical SDKs
- [ ] Native splash screen
- [ ] React Navigation + native screens
- [ ] FlatList tuned for initial render
- [ ] CI perf tests enabled

---

## 🚀 Ideal Startup Flow
1. Native splash instantly
2. Hermes loads bytecode
3. Basic Shell UI mounts
4. Defer analytics + SDK init
5. Fetch + hydrate data lazily
6. Display real content progressively

---

**Principle:**  
> Do the least work possible before first render — defer everything else.

---

### 8) How to reduce bundle size or network requests?

## 🧩 Strategies to Reduce JS Bundle Size

### 1) Metro & Build Optimizations
- Enable **Hermes** (AOT bytecode → smaller memory + faster startup)
- Enable **`inlineRequires: true`** (lazy load modules)
- Minify production code (Terser/Uglify)
- Source maps → upload to server, **not bundled**
- Use lazy imports for heavy feature modules
- Remove console logs in production

```js
// metro.config.js
module.exports = {
  transformer: {
    getTransformOptions: async () => ({
      transform: { inlineRequires: true }
    })
  }
}
```

---

### 2) Remove Unused Libraries & Code
- Audit bundle with `react-native-bundle-visualizer`
- Avoid wildcard imports

```js
// ❌ Pulls entire library
import _ from "lodash"

// ✅ Cherry-pick
import debounce from "lodash/debounce"
```

- Replace heavy dependencies:
  - `moment` → `dayjs` or `date-fns`
  - `lodash` → native JS or cherry‑pick
- Enable `"sideEffects": false` in libs for tree‑shaking

---

### 3) Remove Unused Video Modules & SDKs
- Video SDKs are **heavy** — import only if needed
- Lazy loading video feature modules:

```ts
const VideoPlayer = React.lazy(() => import('./VideoPlayerScreen'));
```

- Split app variants: only ship video modules to builds that need them
- Prefer platform players over multi‑feature video SDKs

---

### 4) Defer Heavy Modules (Code‑Splitting)
Lazy‑load:
- Chat screens
- Maps
- Charts
- Video
- Onboarding flows
- Admin tools / diagnostic tools

---

### 5) Asset Offloading (CDN First)
- **Do NOT embed big assets in JS bundle**
- Serve images, docs, lottie, JSON from CDN
- Hash file names for immutable caching

Example CDN format:  
`https://cdn.app.com/assets/v1/banner.abc123.webp`

---

## 🌍 Translations Optimization

### Strategy
- Bundle only a **base locale** with the app
- Fetch and cache user locale at runtime
- Version & hash language packs on CDN
- Store downloaded pack locally for offline use

```ts
const localeUrl = `${CDN}/i18n/${version}/${locale}/strings.${hash}.json`;
```

### Benefits
- Smaller install size
- Supports OTA language updates
- Faster initial JS load

---

## 🖼️ Image Optimization

### Strategy
- Deliver images over CDN
- Use formats: **WebP/AVIF**
- Device‑aware responsive images (`?w=600&q=80`)
- Pre‑cache frequently used images:

```ts
Image.prefetch(imageUrl)
```

### Offline Cache
- Use `react-native-fast-image` or download to file system for persistent cache

---

## 💾 Caching Immutable Network Requests

### Server Headers
Use **immutable caching** to avoid refetch:

```
Cache-Control: public, max-age=31536000, immutable
ETag: "<hash>"
```

### Client Strategy
- Cache hashed content in filesystem
- Use **react-query** for dedupe + stale‑while‑revalidate

```ts
const query = useQuery(['feed'], getFeed, { staleTime: 60000 });
```

---

## 🌐 Network Optimization Techniques

### Reduce Unnecessary Requests
- Batch API calls
- Debounce search queries

```js
const debouncedSearch = useMemo(() => debounce(fetchResults, 400), []);
```

### Transport
- Enable gzip/brotli compression on server
- Prefer HTTP/2 / HTTP/3
- Minimize auth headers (use cookies or short tokens)

### Cancel Stale Requests
```ts
const controller = new AbortController();
fetch(url, { signal: controller.signal });
controller.abort();
```

### Retry Logic
- Use exponential backoff + jitter

---

## 📦 Final Checklist

### Bundle Size Checklist
- [ ] Hermes enabled + inlineRequires
- [ ] Lazy load feature modules
- [ ] Remove unused deps & heavy video libs
- [ ] Cherry‑pick imports (lodash/moment)
- [ ] Images & translations served via CDN
- [ ] Tree‑shaking enabled (`sideEffects: false`)
- [ ] Dev tools stripped from prod builds
- [ ] CI bundle size alerts enabled

### Network Checklist
- [ ] CDN for assets & translations
- [ ] Cache immutable content with hashed URLs
- [ ] react‑query / SWR caching
- [ ] Pagination & debouncing
- [ ] Gzip/Brotli compression
- [ ] AbortController & retry logic

---

## 🧠 Senior Summary
> “Ship the minimum necessary JS and assets. Defer everything else.  
> Fetch translations & images remotely, hash & cache aggressively, lazy‑load heavy modules, and enforce bundle budgets in CI.”

This approach **improves startup, reduces app size, optimizes OTA**, and keeps the app scalable.

---

### 6) How does JS thread and Main thread communicate while making a UI and executing business logic?

---
### 9) How do you measure App performance?
### 10)  What tools do you use for performance monitoring ?
### 11) How do you log and monitor error in production? (JS Error, native error) How do you handle them without crashing the app?
### 12) How do you manage CI/CD ? How did you implement OTA?

---

### 13) How to debug React Native applications?

- **Console logging:** `console.log`, `console.warn`, etc.  
- **CLI logs:**  
  - Android → `npx react-native log-android`  
  - iOS → `npx react-native log-ios`
- **Flipper (recommended):** Inspect logs, network, layout, performance.  
- **VS Code / React Native Debugger:** Set breakpoints and step through JS.  
- **Hermes Debugger:** Native debugging for Hermes engine.  
- **Native tools:** Android Studio and Xcode for native-side debugging.  
- **Profiling:** Use Flipper plugins, Android Profiler, Xcode Instruments.  
- **Hot Reload / Fast Refresh:** Speeds up iteration for JS code changes.


