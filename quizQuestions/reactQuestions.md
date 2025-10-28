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
