---
title: Promise.withResolvers
type: js
difficulty: easy
topic: promises-async
order: 6
tags: [promises, async, polyfill]
estimatedMinutes: 5
---

Implement `promiseWithResolvers()`, which behaves like `Promise.withResolvers()`. Export it as `export default function promiseWithResolvers()`. Don't use the native `Promise.withResolvers`.

It returns an object `{ promise, resolve, reject }`, so the promise can be settled from **outside** its executor.

- `promise` is a real, initially **pending** `Promise`.
- `resolve(value)` fulfils it; `reject(reason)` rejects it. They behave exactly like the executor's own functions: only the **first** call counts, and resolving with another promise (or thenable) adopts its outcome.
- Every call returns a **new, independent** set.

```js
const { promise, resolve } = promiseWithResolvers();
setTimeout(() => resolve('done'), 100);
await promise; // 'done'

const d = promiseWithResolvers();
d.reject(new Error('nope'));
await d.promise; // throws Error('nope')
```

**Constraints:** `resolve` and `reject` must be usable immediately after the call returns (synchronously), and can be called with no `this` (e.g. passed as callbacks).

## Notes

- **Approach:** declare `let resolve, reject;` outside, then `const promise = new Promise((res, rej) => { resolve = res; reject = rej; });` and return all three.
- **Why it works:** the executor runs **synchronously** inside `new Promise(...)`, so both variables are assigned before the constructor returns.
- **No wrapping needed:** the executor's `res`/`rej` are already bound and idempotent, so passing them out directly gives you "first call wins" and promise adoption for free.
- **Complexity:** O(1).
- **Pitfalls:** returning `{ promise, resolve: promise.resolve }` (not a thing), or building a fresh `new Promise` inside `resolve`.
- **Follow-ups:** the "deferred" pattern in practice: a request queue that hands out promises and settles them when a response arrives, an event-to-promise adapter (`once(emitter, 'ready')`), and test helpers that control exactly when an async dependency resolves.
