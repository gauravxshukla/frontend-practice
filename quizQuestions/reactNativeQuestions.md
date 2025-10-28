# React Native Interview Questions — Answers (Updated, without Deep Linking)

---

### 1) Difference between FlatList and ScrollView? Which to use and when?

- **ScrollView** renders **all** its child components at once.  
  Suitable for small or static lists. Can cause performance and memory issues with large lists.

- **FlatList** (and `SectionList`) use **windowed rendering** — only visible items and a small buffer are rendered.  
  Ideal for large or dynamic datasets.  
  Includes advanced features such as:
  - `data`, `renderItem`, `keyExtractor`
  - `onEndReached`, `getItemLayout`
  - Pull-to-refresh, separators, virtualization

**When to use:**  
- `ScrollView` → small, fixed content.  
- `FlatList` → long or dynamic lists.

---

### 2) How many threads does React Native have? Explain them.

React Native uses several key threads:

- **UI / Main Thread (Platform Thread):** Handles rendering and user input.  
- **JS Thread:** Executes JavaScript logic and React component rendering.  
- **Shadow / Layout Thread (Old Architecture):** Computes Yoga layout asynchronously.  
- **Native Modules Threads:** For background work like networking, file I/O, image decoding.  
- **Render Thread (Android):** Handles GPU composition for drawing UI.

> In the **New Architecture (Fabric + JSI)**, layout and rendering run more concurrently and efficiently, reducing bottlenecks.

---

### 4) What is Hermes? Why is it used?

- **Hermes** is Meta’s optimized JavaScript engine for React Native.  
  It improves performance, startup speed, and memory usage.

**Benefits:**
- Faster startup (precompiled bytecode)
- Lower memory footprint
- Predictable, consistent performance
- Integrated debugging via Flipper and Hermes Debugger
- Works cross-platform (Android & iOS)

**Enable Hermes**
- **Android:** `android/app/build.gradle` → `enableHermes: true`  
- **iOS:** In Podfile → `use_hermes!`

---

### 5) How to debug React Native applications?

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

---

### 6) Explain React Native Bridge in Old Architecture

- **Bridge:** Asynchronous JSON-based message queue between JS and Native.  
  JS sends serialized commands (e.g., create/update view) → Native processes → Optional callbacks return results.

**Limitations:**
- Asynchronous and single-threaded communication.  
- Overhead from JSON serialization / deserialization.  
- Latency during frequent JS-Native interactions (e.g., animations, gestures).

---

### 7) What is New Architecture? Explain its benefits over Old Architecture

**Core Components**
- **JSI (JavaScript Interface):** Direct C++ bridge replacing JSON serialization.  
- **TurboModules:** Modern, high-performance native modules system.  
- **Fabric:** Concurrent rendering system for more efficient UI updates.  
- **C++ Core:** Shared logic across iOS and Android.

**Benefits**
- Zero-copy, synchronous native access (no JSON bridge).  
- Concurrent rendering → smoother UI.  
- Lower overhead, better performance.  
- Improved native interoperability and memory management.  
- Works efficiently with Hermes engine.

---

### 8) How does JS thread and Main thread communicate while making a UI and executing business logic?

**Old Architecture:**  
- JS sends UI commands via the Bridge (serialized JSON).  
- Native executes them on the UI/Main thread.  
- Events are sent back asynchronously to JS.

**New Architecture:**  
- **JSI** provides direct, synchronous JS ↔ Native calls (no JSON).  
- **Fabric Renderer** batches and commits UI updates efficiently.  
- **TurboModules** enable fast access to native functionality.  
- Events flow:  
  - JS → Fabric → UI thread for rendering  
  - User input → Native event → JS handlers  
- JS thread should remain non-blocking; heavy work should move to background or native threads.

---
