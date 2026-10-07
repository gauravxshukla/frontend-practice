---
title: Redux Store
type: js
difficulty: medium
topic: classes-design
order: 3
tags: [state-management, pub-sub, closures, design]
estimatedMinutes: 25
---

Implement `createStore(reducer, preloadedState)` (the default export), a minimal version of Redux's store. It returns `{ getState, dispatch, subscribe }`.

- `getState()` returns the current state.
- `dispatch(action)` runs `state = reducer(state, action)`, then calls every subscribed listener (with no arguments), and **returns `action`**.
- `dispatch` **throws** if `action` isn't a plain object (`{}` or `Object.create(null)`; not an array, `null`, a function or a class instance) or if `action.type` is `undefined`.
- `dispatch` **throws** if it is called while the reducer is running (a reducer must be pure). The store stays usable after a reducer throws.
- `subscribe(listener)` returns an **unsubscribe** function. Calling it more than once is harmless. The same function subscribed twice is called twice.
- When the store is created, it dispatches `{ type: '@@INIT' }` so the reducer's default state applies (`preloadedState` is `undefined` unless you pass it).
- `createStore` throws if `reducer` isn't a function.

```js
const counter = (state = 0, action) => (action.type === 'inc' ? state + 1 : state);
const store = createStore(counter);

store.getState(); // 0
const unsubscribe = store.subscribe(() => console.log('now', store.getState()));
store.dispatch({ type: 'inc' }); // logs "now 1", returns { type: 'inc' }
unsubscribe();
```

**Constraints:** each `dispatch` notifies a **snapshot** of the listeners taken before they are called. A listener that unsubscribes itself (or another listener) during a dispatch doesn't stop the others in that snapshot from being called; a listener subscribed during a dispatch is first called on the next one. Listeners are called in subscription order.

## Notes

- **Approach:** a closure holding `state`, `listeners` and an `isDispatching` flag. `dispatch` validates the action, sets the flag, runs the reducer in `try/finally` (so a throwing reducer doesn't leave the store locked), then notifies a copy of the listener list.
- **Why snapshot:** mutating an array while iterating it with an index skips or repeats entries. Redux keeps `currentListeners` / `nextListeners` and copies lazily; `listeners.slice()` per dispatch is the simple version.
- **Duplicate subscriptions:** wrap each listener in its own entry object so unsubscribe removes *that* entry, and guard it with a flag so a second call does nothing.
- **Plain-object check:** `Object.getPrototypeOf(action)` is `Object.prototype` or `null`. Middleware such as redux-thunk exists precisely because functions aren't allowed here.
- **Why `@@INIT`:** reducers declare their default state through a default parameter. Real Redux appends a random suffix so no user reducer can handle it by accident.
- **Complexity:** dispatch is O(reducer + listeners); subscribe O(1); unsubscribe O(listeners).
- **Follow-ups:**
  - **`combineReducers`:** split state by key.
  - **`applyMiddleware`:** compose `store => next => action` functions around `dispatch`.
  - **Selectors and `useSyncExternalStore`:** how React-Redux subscribes and avoids tearing.
  - **`replaceReducer`:** for code splitting.
