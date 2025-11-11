# Advanced React Snippet Questions — Senior Frontend Interviews

Each item includes:
- **Snippet** (copy-paste ready)
- **Expected behavior / output**
- **Why it happens** (what to say in an interview)
- **Variants / follow-ups** interviewers like

---

## 1 — State batching and stale state (hooks)
```jsx
function Counter() {
  const [count, setCount] = React.useState(0);
  function inc() {
    setCount(count + 1);
    setCount(count + 1);
  }
  return <button onClick={inc}>{count}</button>;
}
```
**Behavior:** Clicking increments by 1, not 2.
**Why:** Both updates read the same captured `count`. Use functional updaters: `setCount(c => c+1)`.

---

## 2 — useEffect dependency closure trap
```jsx
function Timer() {
  const [t, setT] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setT(t + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{t}</div>;
}
```
**Behavior:** `t` doesn't increment properly.
**Why:** Interval callback closes over initial `t`. Use `setT(v => v + 1)` or include deps and cleanup.

---

## 3 — Effect cleanup ordering
```jsx
function App() {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    console.log('effect', n);
    return () => console.log('cleanup', n);
  }, [n]);
  return <button onClick={() => setN(n+1)}>{n}</button>;
}
```
**Behavior:** On update: `cleanup oldN` then `effect newN`.
**Why:** React runs previous cleanup before running the next effect. In StrictMode, effects mount/unmount twice in dev.

---

## 4 — Event listeners + stale closures
```jsx
function App() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const onDoc = () => setCount(c => c + 1);
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);
  return <div>{count}</div>;
}
```
**Behavior:** Works because of functional updater; using `setCount(count+1)` would be stale.
**Why:** Functional updater reads fresh state avoiding stale closure.

---

## 5 — useRef mutation doesn't re-render
```jsx
function Timer() {
  const countRef = React.useRef(0);
  React.useEffect(() => {
    const id = setInterval(() => { countRef.current++; }, 1000);
    return () => clearInterval(id);
  }, []);
  return <div>{countRef.current}</div>;
}
```
**Behavior:** UI won't update though `countRef.current` changes.
**Why:** `useRef` mutations are not reactive; use state to reflect visible changes.

---

## 6 — Keys and reconciliation (index as key)
```jsx
function List({items}){
  return items.map((it, i) => <div key={i}>{it}</div>);
}
```
**Behavior:** Reordering/inserting may reuse DOM incorrectly.
**Why:** Index keys break identity; use stable unique ids.

---

## 7 — Controlled vs uncontrolled inputs
```jsx
function C(){ const [v, setV] = React.useState(); return <input value={v} onChange={e => setV(e.target.value)} />; }
```
**Behavior:** React warns about switching from uncontrolled to controlled.
**Why:** Initialize state explicitly (e.g., `''`) for controlled inputs.

---

## 8 — useMemo misuse (missing deps)
```jsx
function Comp({a}){
  const val = React.useMemo(() => expensive(a), []);
  return <div>{val}</div>;
}
```
**Behavior:** `expensive` runs once; `val` stale when `a` changes.
**Why:** Add `a` to deps or avoid unnecessary memoization.

---

## 9 — useCallback and stale closures
```jsx
function Parent(){
  const [n] = React.useState(0);
  const cb = React.useCallback(() => console.log(n), []);
  return <Child onClick={cb} />;
}
```
**Behavior:** `cb` logs initial `n` always.
**Why:** `n` omitted from deps; include it to capture latest or use ref to read mutable value.

---

## 10 — setState in class components (batching)
```jsx
class C extends React.Component {
  state = {n:0}
  inc(){
    this.setState({n: this.state.n + 1});
    this.setState({n: this.state.n + 1});
  }
}
```
**Behavior:** May increment by 1 due to batching. Use functional `setState(s => ({n: s.n + 1}))`.

---

## 11 — Suspense + lazy loading errors
```jsx
const Lazy = React.lazy(() => import('./NoExist'));
function App(){ return <React.Suspense fallback={<div>...</div>}><Lazy/></React.Suspense>; }
```
**Behavior:** If import fails, Suspense doesn't catch errors — you need an Error Boundary.
**Why:** Suspense handles loading states; combine with Error Boundaries for failures.

---

## 12 — StrictMode double-invoke effects
```jsx
function App(){ React.useEffect(() => console.log('effect'), []); return null; }
```
**Behavior:** In dev with StrictMode, mount/unmount/mount causes `effect` appear twice.
**Why:** React intentionally double-invokes to reveal side effects during development.

---

## 13 — Synthetic event pooling (historical)
```jsx
function App(){
  function onClick(e){
    setTimeout(() => console.log(e.type), 0);
  }
  return <button onClick={onClick}>Click</button>;
}
```
**Behavior:** In older React versions, `e.type` may be null unless `e.persist()` used. Modern React removed pooling.
**Why:** Understand synthetic events lifecycle; prefer copying values if used async.

---

## 14 — PureComponent / memo and mutated props
```jsx
class List extends React.PureComponent {
  render(){ return this.props.items.map(i => <div key={i.id}>{i.v}</div>); }
}
```
**Behavior:** In-place mutations don't update shallow compare; component won't re-render.
**Why:** Treat props as immutable; create new references.

---

## 15 — setState in render (infinite loop)
```jsx
function Bad(){ const [n, setN] = React.useState(0); if (n === 0) setN(1); return <div>{n}</div>; }
```
**Behavior:** Infinite render loop / stack overflow.
**Why:** Side effects must be in useEffect or handlers, not render body.

---

## 16 — forwardRef and useImperativeHandle
```jsx
const Comp = React.forwardRef((props, ref) => {
  const localRef = React.useRef();
  React.useImperativeHandle(ref, () => ({ focus: () => localRef.current.focus() }));
  return <input ref={localRef} />;
});
```
**Behavior:** Parent can call exposed `focus` method via ref.
**Why:** Expose limited imperative API; don't leak internal structure.

---

## 17 — Select values are strings in DOM
```jsx
function Sel(){
  const [v, setV] = React.useState('2');
  return (
    <select value={v} onChange={e=>setV(e.target.value)}>
      <option value={1}>One</option>
      <option value={2}>Two</option>
    </select>
  );
}
```
**Behavior:** Option values are strings; mismatches between number and string produce unexpected selection.
**Why:** Convert types consistently or normalize values.

---

## 18 — startTransition and low-priority updates
```jsx
const [isPending, startTransition] = React.useTransition();
function onClick(){ startTransition(() => setBigState(...)); }
```
**Behavior:** Updates inside `startTransition` are interruptible and low-priority.
**Why:** Use for expensive rendering that can be deferred to keep UI responsive.

---

## 19 — useLayoutEffect vs useEffect
```jsx
React.useLayoutEffect(() => { /* measure DOM */ }, []);
```
**Behavior:** Runs synchronously after DOM mutations before paint; `useEffect` runs after paint.
**Why:** Use `useLayoutEffect` for measurements that must be synchronous to avoid flicker.

---

## 20 — Referential equality for inline objects
```jsx
function Parent(){
  const cfg = {a:1};
  return <Child cfg={cfg} />;
}
const Child = React.memo(({cfg}) => <div/>);
```
**Behavior:** Child re-renders every Parent render due to new object ref.
**Why:** Use `useMemo(() => ({a:1}), [])` to keep stable ref.

---

## 21 — Hydration mismatch in SSR
```jsx
// server: <div>0</div>
// client render: <div>{Math.random()}</div>
```
**Behavior:** Hydration warning and possible re-render replacing server HTML.
**Why:** Ensure deterministic markup during SSR; avoid random values or use placeholders.

---

## 22 — Error Boundary scope and limitations
```jsx
class EB extends React.Component{
  state = {error:null};
  static getDerivedStateFromError(e){ return {error: e}; }
  render(){ if (this.state.error) return <div>Err</div>; return this.props.children; }
}
```
**Behavior:** Catches render errors in children, not asynchronous event handler errors.
**Why:** Use try/catch inside event handlers, or top-level error boundaries for render/.

---

## 23 — Hooks rules violation (conditional hooks)
```jsx
function C({flag}){
  if (flag) React.useEffect(() => {}); // conditional hook — wrong
  return null;
}
```
**Behavior:** Violates rules of hooks; leads to broken state associations.

**Why:** Hooks must be called in the same order on every render; follow top-level usage or wrap in custom hooks.

---

## 24 — Virtualization necessity for large lists
**Snippet:** N/A (conceptual)
**Behavior:** Rendering thousands of rows causes jank and memory usage.
**Why:** Use windowing (react-window, react-virtualized) to only render visible items and reduce cost.

---

## 25 — Context value identity and memoization
```jsx
const Ctx = React.createContext();
function Provider({children}){
  const [v, setV] = React.useState(0);
  return <Ctx.Provider value={{v, setV}}>{children}</Ctx.Provider>;
}
```
**Behavior:** Every provider render creates new object identity causing consumers to re-render.
**Why:** Memoize value: `useMemo(() => ({v, setV}), [v])` to prevent unnecessary renders.

---

## 26 — useEffect dependency on prop functions
```jsx
function Parent({onClick}){
  React.useEffect(() => { /* do something with onClick */ }, [onClick]);
}
```
**Behavior:** If `onClick` is recreated each render, effect runs every time.
**Why:** Stabilize functions with `useCallback` upstream or store in ref if appropriate.

---

## 27 — Portals and event bubbling
```jsx
function App(){ return ReactDOM.createPortal(<button onClick={() => console.log('inside')}>X</button>, document.body); }
```
**Behavior:** Events from portal content bubble to React tree as expected but DOM hierarchy differs.
**Why:** Portals keep React context but render into different DOM subtree; watch for event delegation and CSS context.

---

## 28 — Updating state during render phase via Suspense fallback
```jsx
function C(){ const [s, setS] = React.useState(0); if (s === 0) throw Promise.resolve().then(() => setS(1)); return <div>{s}</div>; }
```
**Behavior:** This is a contrived Suspense-for-data pattern; throwing promises as control flow can be used but is advanced and brittle.
**Why:** Suspense expects thrown promises; prefer established data fetching libraries that integrate with Suspense.

---

## 29 — Profiler usage and commit phases
```jsx
<React.Profiler id="app" onRender={(id, phase, actualTime) => console.log(phase, actualTime)}>
  <App/>
</React.Profiler>
```
**Behavior:** `onRender` measures render/commit durations; useful for performance tuning.
**Why:** Know where to attach profiler and interpret render vs commit times.

---

## 30 — Automatic batching across async (React 18)
```jsx
async function doWork(){
  setCount(c => c + 1);
  await Promise.resolve();
  setCount(c => c + 1);
}
```
**Behavior:** In React 18, automatic batching may group setState across microtasks within React events; but `await` may break batches depending on environment — automatic batching improved to include many cases.
**Why:** Explain differences between legacy and React 18 automatic batching and when to rely on it.

---

## 31 — Context + memo: consumer re-renders
```jsx
const Ctx = React.createContext(0);
const Child = React.memo(() => { const v = React.useContext(Ctx); return <div>{v}</div>; });
```
**Behavior:** Child re-renders whenever context value changes regardless of `React.memo` because context reading triggers update.
**Why:** Context updates bypass memoization on consumer if it reads context; split providers or selectors to reduce rerenders.

---

## 32 — setState from stale props inside effect
```jsx
function C({value}){
  const [v, setV] = React.useState(value);
  React.useEffect(() => { setV(value); }, []); // bug: missing deps
}
```
**Behavior:** `v` won't update after prop change due to missing deps.
**Why:** Always consider deps; initialize state from props and update when prop changes or use derived state carefully.

---

## 33 — React children identity and keys across portals
```jsx
// Parent renders <Child key={id}/> into portal sometimes
```
**Behavior:** Changing where a child is rendered or changing its key causes unmount/remount; keys control identity not DOM location.
**Why:** Use consistent keys and understand remounts when moving components across DOM subtrees.

---

## 34 — Error boundary + async errors (Promise rejection)
```jsx
function AsyncButton(){ onClick = async () => { throw new Error('boom'); } }
```
**Behavior:** Errors in event handlers aren't caught by Error Boundaries; they need try/catch or window.onerror handlers.
**Why:** Error boundaries catch render lifecycle errors, not asynchronous event errors.

---

## 35 — React Server Components (conceptual)
**Snippet:** N/A
**Behavior:** Server Components run on server, can send UI over the wire; they can't use state or effects.
**Why:** Understand boundaries between Server and Client components, data fetching, and bundling differences.

---

## 36 — useSyncExternalStore for external stores
```jsx
// Correct subscription pattern for external stores
React.useSyncExternalStore(subscribe, getSnapshot);
```
**Behavior:** Provides consistent, concurrent-safe external store subscriptions for React 18+.
**Why:** Use for libraries exposing external mutable state (e.g., Redux with modern adapters).

---

## 37 — setState during unmount (no-op)
```jsx
function C(){
  const [v, setV] = React.useState(0);
  React.useEffect(() => { setTimeout(() => setV(1), 1000); }, []);
  return null;
}
```
**Behavior:** If component unmounts before timeout, setState is a no-op (React warns in older versions).
**Why:** Cancel async tasks in cleanup to avoid memory leaks or warnings.

---

## 38 — Reconciliation when component type changes
```jsx
{ condition ? <A /> : <B /> }
```
**Behavior:** If A and B are different component types, React unmounts A and mounts B (full subtree remount).
**Why:** Component identity matters for preserving state; keys can additionally force remounts.

---

## 39 — Lazy initialization of state
```jsx
const [state, setState] = React.useState(() => expensiveInit());
```
**Behavior:** `expensiveInit` runs only once on mount; avoids computing on every render.
**Why:** Use lazy initializer for heavy initial state computation.

---

## 40 — Context + multiple providers ordering
```jsx
<ThemeProvider value={t}><AuthProvider value={a}><App/></AuthProvider></ThemeProvider>
```
**Behavior:** Consumers read nearest provider above them; provider order determines values read when multiple contexts consulted.
**Why:** Understand how providers compose and that reordering providers can change behavior; consider colocating related providers.

---

## Interview tips & how to answer
1. **Start with expected output** or rendered behavior quickly.  
2. **Explain the spec-level reason** (hook rules, closure, reconciliation, event loop). Use keywords: *closure*, *TDZ*, *reconciliation*, *concurrent rendering*, *microtask/macrotask*, *effect timing*, *memoization*, *referential identity*, *hydration*.  
3. **Show fixes or minimal change** (functional updaters, memo, stable deps, cleanup).  
4. **Mention tradeoffs & performance** implications where relevant (e.g., `useLayoutEffect` vs `useEffect`, virtualization).  
5. **Offer variants** the interviewer can ask (edge-cases, StrictMode behavior, SSR differences).

---
