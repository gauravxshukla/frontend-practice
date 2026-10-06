# React Interview Questions — Answers

---
### 1) Explain useMemo and useCallback hook in React with example

- **useMemo:** Memoizes the **result** of a computation to prevent unnecessary recalculations.
```javascript
const expensiveValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```
- **useCallback:** Memoizes the **function references** itself to prevent re-creation on every render.
```javascript
const handleClick = useCallback(() => setCount(c => c + 1), []);
```
✅ **useMemo** → caches **value**, **useCallback** → caches **function**.

---
### 2) Explain useEffect hook with cleanup function

`useEffect` runs side effects after rendering — like fetching data, setting timers, or DOM updates.  
The cleanup function runs before the component unmounts or before re-running the effect.

```javascript
useEffect(() => {
  const id = setInterval(() => console.log("Running"), 1000);
  return () => clearInterval(id); // Cleanup
}, []);
```

---
### 3) Explain lifecycle of a functional component

Functional components follow three main phases through **hooks**:

1. **Mounting:** `useEffect(() => {...}, [])` runs once after render.  
2. **Updating:** `useEffect(() => {...}, [deps])` runs when dependencies change.  
3. **Unmounting:** Cleanup function runs before component is destroyed.

---
### 4) How does React re-render? Also, explain reconciliation and diffing

- React re-renders a component when its **state or props** change.  
- During re-render, React compares the new virtual DOM tree with the previous one using the **diffing algorithm**.  
- **Reconciliation:** Process of updating the real DOM to match the virtual DOM efficiently by only applying the minimal set of changes.

---
### 5) What is Virtual DOM? How does it work?

The **Virtual DOM** is a lightweight JS object representation of the real DOM.  
When state changes → React creates a new virtual DOM → compares (diffs) with the previous one → applies minimal real DOM updates.

Benefits: Faster updates, better performance, declarative rendering.

---
### 6) What are Pure Components?

Pure components are components that **only re-render** when their props or state change.  
They perform a **shallow comparison** of props and state to prevent unnecessary re-renders.

```javascript
class MyComponent extends React.PureComponent { ... }
```
Equivalent in functional components: `React.memo()`.

---
### 7) What is React Fiber?

**React Fiber** is the internal engine (reimplementation of React core) that enables **incremental rendering**, **scheduling**, and **concurrent mode**.  
It breaks rendering work into smaller units (fibers) and pauses/resumes rendering as needed for responsiveness.

---
### 8) What is Context API? Explain its use

**Context API** allows data to be shared globally across components without prop drilling.

```javascript
const UserContext = createContext();
<UserContext.Provider value={user}><Profile /></UserContext.Provider>
const user = useContext(UserContext);
```

Use it for: themes, authentication, user preferences.

---
### 9) Redux or Zustand or Context API — Which to choose and why?

- **Context API:** Simple global state, no middleware. Best for small apps.  
- **Redux:** Predictable state management with strict flow (actions → reducers → store). Good for large apps.  
- **Zustand:** Lightweight, simpler alternative to Redux using hooks.

✅ For large apps → Redux  
✅ Medium → Zustand  
✅ Small → Context API

---
### 10) What is Redux? Why is it used?

Redux is a **predictable state container** for JavaScript apps.  
It uses a single store and pure reducers to manage global state.

**Flow:**  
Component → dispatch(action) → reducer → store → UI updates.

Used for centralized state, debugging (Redux DevTools), and predictable data flow.

---
### 11) What is React.lazy, React.memo? When should I use them?

- **React.lazy:** Enables **code-splitting** by dynamically importing components.
```javascript
const About = React.lazy(() => import('./About'));
```
Use with `<Suspense>`.

- **React.memo:** Prevents unnecessary re-renders by memoizing the component output based on props.
```javascript
export default React.memo(MyComponent);
```

---
### 12) What are Hooks? Explain all types

Hooks let you use state and lifecycle methods in functional components.

- **useState** → Local state  
- **useEffect** → Side effects  
- **useContext** → Access context  
- **useReducer** → Alternative to Redux pattern  
- **useMemo / useCallback** → Performance optimization  
- **useRef** → Access DOM or persist values  
- **useLayoutEffect** → Sync effects before paint  
- **Custom hooks** → Reusable logic

---
### 13) Explain Code-splitting with an example

Splits app into smaller bundles that load lazily.

```javascript
const Settings = React.lazy(() => import('./Settings'));
<Suspense fallback={<Loader />}><Settings /></Suspense>
```

Improves performance and load times.

---
### 14) What is Next.js and its major features

**Next.js** is a React framework for production-grade apps.  

Features:  
- Server-Side Rendering (SSR)  
- Static Site Generation (SSG)  
- Incremental Static Regeneration (ISR)  
- API Routes  
- Image optimization  
- File-based routing

---
### 15) Difference between async mode and concurrent mode

- **Async mode (old term):** Experimental name for what became concurrent mode.  
- **Concurrent mode:** React can pause, resume, and prioritize renders → smoother UX.

---
### 16) What is the use of key prop and why must it be unique?

`key` helps React identify which items changed, added, or removed during reconciliation.  
Unique keys prevent incorrect DOM reuse and improve rendering efficiency.

---
### 17) Difference between Controlled and Uncontrolled Components

- **Controlled:** Form elements controlled via React state.
```javascript
<input value={value} onChange={e => setValue(e.target.value)} />
```
- **Uncontrolled:** Managed by the DOM using refs.
```javascript
<input ref={inputRef} />
```

---
### 18) What is useRef hook and when should it be used?

`useRef` stores a **mutable value** that persists across renders without triggering re-render.

Used for:  
- Accessing DOM nodes  
- Storing previous values  
- Avoiding re-renders for stored data

```javascript
const inputRef = useRef();
<input ref={inputRef} />
```

---
### 19) What are Error Boundaries in React for?

Error boundaries catch runtime errors in child components and prevent entire app crashes.

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <h1>Error!</h1> : this.props.children; }
}
```

Hooks can’t handle this; only class components.

---
### 20) What is React Suspense?

**React Suspense** allows components to “wait” for asynchronous data (e.g., lazy loading, data fetching).  
Used with `React.lazy` and future data fetching APIs.

```javascript
<Suspense fallback={<Spinner />}><Profile /></Suspense>
```

---
### 21) What is forwardRef() used for?

`forwardRef` passes a ref from parent to child, allowing direct DOM or component reference access.

```javascript
const MyInput = React.forwardRef((props, ref) => <input ref={ref} {...props} />);
```

---
### 22) Explain React Hydration

**Hydration** is the process where React attaches event listeners to pre-rendered HTML (SSR) to make it interactive.  
Used in SSR/Next.js apps.

---
### 23) Explain Synthetic Events in React

Synthetic Events are React’s cross-browser wrapper around native DOM events.  
They ensure consistent behavior across browsers and use a unified event system.

```javascript
<button onClick={e => console.log(e.nativeEvent)} />
```

---
### 24) What are Higher-Order Components (HOC)? Presentational vs Container pattern

**HOC:** A function that takes a component and returns a new component with added behavior.
```javascript
function withLogger(Wrapped) {
  return function(props) {
    console.log('Render');
    return <Wrapped {...props} />;
  };
}
```
**Presentational vs Container:**
- **Presentational:** UI only, no logic (dumb components).  
- **Container:** Handles logic, connects to state/store.

---
### 25) What are Render Props in React?

Pattern where a component’s child is a function that receives data to render UI.

```javascript
<Mouse render={pos => <p>{pos.x}, {pos.y}</p>} />
```

---
### 26) Explain Composition Pattern in React

Composition replaces inheritance for reusing logic.  
Combine small reusable components via props or children.

```javascript
const Card = ({ children }) => <div className="card">{children}</div>;
<Card><Profile /></Card>;
```
---

### 27) Explain what State Management library would you prefer and why? (Redux, Zustand, Context)

- **Context + useReducer**
  - Built-in, zero-deps, great for small-to-medium scoped state (theme, auth).
  - Avoids extra runtime; but can cause re-renders if provider value changes frequently.
  - Use when app needs simple global state without complex middleware.

- **Redux (Redux Toolkit)**
  - Predictable single source of truth, time-travel debugging, middleware ecosystem (thunk/saga/rtk-query).
  - Good for large apps with complex state interactions, strict data flow, and teams needing clear patterns.
  - Use `createSlice`, `RTK Query` for data fetching to reduce boilerplate.
  - Downsides: boilerplate (mitigated by RTK), potential verbosity.

- **Zustand**
  - Lightweight, minimal API, selective subscriptions (no unnecessary re-renders).
  - Great for performance-critical apps and local/global hybrid state.
  - Simple migration path and small bundle size compared to Redux.
  - Use when you need fine-grained updates without boilerplate.

- **Decision factors**:
  - Data complexity, team familiarity, need for middleware/time travel, performance constraints, bundle size.
- **Example recommendation**:
  - Small app: Context + useReducer; Medium-large: Zustand; Very large enterprise with complex flows: Redux Toolkit + RTK Query.

---

### 28) How does React Fiber differ from the older reconciliation algorithm?

- **Fiber** is a reimplementation of the reconciliation algorithm with **incremental rendering** and **prioritization**.
- Key differences:
  - **Incremental work**: breaks rendering work into units of work (fibers) so rendering can be paused/resumed.
  - **Prioritization & scheduling**: supports different priorities (user input, animation, low-priority updates).
  - **Ability to yield**: React can yield to higher priority tasks and resume work later — improves responsiveness.
  - **Better error recovery** and **suspense** support since work can be split.
- Internally, Fiber represents each element as a linked tree of fiber nodes with pointers (`child`, `sibling`, `return`) enabling DFS traversal and diffing in chunks.
- Result: smoother UI, reduced jank, and foundation for concurrent features.

---

### 29) What are concurrent features in React 18, and how do they work internally?

- **Concurrent features** enable React to prepare multiple versions of the UI and interrupt work for higher-priority updates.
- Notable features:
  - **Automatic batching**: batches multiple state updates across event handlers/promises to reduce re-renders.
  - **startTransition**: mark low-priority updates that can be interrupted to keep UI responsive.
  - **useDeferredValue**: defer a value to avoid blocking urgent updates.
  - **Suspense for data fetching + streaming SSR**: allows showing placeholders while async data is being fetched.
- **Internals**:
  - Built on Fiber scheduler — updates tagged with priorities; work is scheduled and can be paused/resumed.
  - `startTransition` marks updates with lower priority in the scheduler.
  - React maintains multiple "lanes" (priority lanes) to classify and manage concurrent updates.
- **Practical guidance**:
  - Use `startTransition` for navigation, filtering, or large list updates.
  - Use Suspense + server components/streaming SSR to improve TTFB and perceived performance.

---

### 30) How does React decide whether to re-render a component?

- **Props/state changes**: React re-renders when parent re-renders or state/props change; reconciliation compares previous and next element trees.
- **Pure components & memoization**:
  - `React.memo` performs shallow prop comparison to skip re-render when props unchanged.
  - `useMemo`, `useCallback` help avoid recreating objects/functions that would trigger prop equality changes.
- **Key heuristics**:
  - If element type differs, React unmounts old subtree and mounts new one.
  - For same element type, React compares props and updates DOM based on diffed Virtual DOM.
- **Avoiding unnecessary renders**:
  - Keep props stable (avoid creating inline objects/arrays/functions in render).
  - Use selective state co-location to minimize affected components.
  - Use selectors in state libs (e.g., Zustand/RTK) to subscribe to slices of state.
- **Example**:
  ```js
  const Item = React.memo(({ item }) => <div>{item.name}</div>);
  ```

---

### 31) How do you handle large lists efficiently in React beyond virtualization (Windowing + React 18 streaming)?

- **Virtualization (Windowing)**:
  - Libraries: `react-window`, `react-virtualized`.
  - Render only visible subset of items to reduce DOM nodes and memory.
- **Chunked rendering / incremental hydration**:
  - Use `startTransition` to render large updates as low-priority work so UI stays responsive.
  - Render items in batches (e.g., `requestIdleCallback` or `setTimeout` chunks) to avoid blocking main thread.
- **Progressive hydration & streaming**:
  - Server-side stream HTML to client (React 18 streaming SSR) so user sees initial content sooner.
  - Hydrate interactive regions progressively instead of full-page blocking hydration.
- **Windowing + virtualization optimizations**:
  - Use item measurement caching, sticky headers, and overscan tuning.
  - Avoid expensive item renders: memoize row components, use `shouldComponentUpdate` or `React.memo`.
- **Data handling**:
  - Use pagination or cursor-based loading; fetch in background with `useDeferredValue`.
  - Use Suspense for data fetching so placeholders render while data arrives.
- **Native-like techniques**:
  - Offload heavy computations to Web Workers.
  - Use `IntersectionObserver` to lazy-load images/content within list items.
- **Example pattern**:
  - Virtualize visible rows, prefetch next page in background, and use `startTransition` to insert new rows without jank.

---