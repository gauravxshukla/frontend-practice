---
title: Promise Polyfill
type: js
difficulty: hard
topic: promises-async
order: 16
tags: [promises, async, polyfill, class, microtasks]
estimatedMinutes: 45
---

Implement a `MyPromise` class with the core behaviour of a native `Promise` (the Promises/A+ model). Don't extend or wrap the native `Promise`.

**Construction**
- `new MyPromise(executor)` calls `executor(resolve, reject)` **synchronously**.
- If the executor throws, the promise rejects with the thrown error.
- A promise settles **only once**: after the first `resolve` or `reject`, later calls are ignored.

**`then(onFulfilled, onRejected)`**
- Returns a **new** `MyPromise`.
- Both callbacks are optional. A missing (or non-function) callback passes the value or the rejection through to the returned promise.
- Callbacks always run **asynchronously** (schedule them with `queueMicrotask`), even if the promise is already settled, and in the order they were registered.
- The returned promise resolves with the callback's return value, or rejects if the callback throws.

**Adoption** (resolving with a value `x`, from `resolve(x)` or from a callback returning `x`)
- If `x` is a thenable (any object or function with a `then` method, including another `MyPromise` or a native `Promise`), adopt its eventual state.
- If `x` is the promise itself, reject with a `TypeError`.
- Otherwise, fulfil with `x`.

**Other methods**
- `catch(onRejected)`: same as `then(undefined, onRejected)`.
- `finally(onFinally)`: calls `onFinally()` with no arguments when the promise settles, then passes the original value or rejection through. If `onFinally` throws (or returns a rejected promise), that error replaces the original outcome.
- `MyPromise.resolve(value)`: returns `value` itself if it is already a `MyPromise`, otherwise a promise resolved with it.
- `MyPromise.reject(reason)`: returns a promise rejected with `reason`.

```js
const p = new MyPromise((resolve) => setTimeout(() => resolve(1), 10));

p.then((x) => x + 1)
  .then((x) => { throw new Error(`bad ${x}`); })
  .then(() => 'skipped')
  .catch((e) => e.message) // 'bad 2'
  .finally(() => console.log('done'));

console.log('sync first'); // logs before any then callback runs

const value = await MyPromise.resolve(42); // 42, because MyPromise is a thenable
```

**Constraints:** use `queueMicrotask` for callbacks, not `setTimeout`. The tests check ordering against synchronous code and between callbacks.

## Notes

- **State:** `state` (`pending` / `fulfilled` / `rejected`), `value`, and a list of handlers `{ onFulfilled, onRejected, resolve, reject }`, where `resolve`/`reject` belong to the promise that `then` returned.
- **`then`:** create the child promise. If pending, store the handler; otherwise schedule it right away. When a handler runs: if the matching callback is missing, forward the value or reason to the child; otherwise `try { childResolve(cb(value)) } catch (e) { childReject(e) }`.
- **The resolution procedure** is the heart of A+: check self-resolution (TypeError), read `x.then` **once** inside `try` (a getter may throw), and if it is a function, call it with `x` as `this` and a fresh pair of once-only resolve/reject functions, because a broken thenable may call both, or call one and then throw.
- **Settle once:** guard both the executor's and the thenable's resolve/reject with a `called` flag. Note that `resolve(thenable)` locks the promise even though it is still pending.
- **`finally`:** `then(v => MyPromise.resolve(onFinally()).then(() => v), e => MyPromise.resolve(onFinally()).then(() => { throw e; }))`.
- **Pitfall:** running callbacks synchronously when already settled ("Zalgo") makes ordering depend on timing. Always defer.
- **Pitfall:** missing the "callback throws" path means a chain can never recover with `catch`.
- **Follow-ups:** `all`, `allSettled`, `race` and `any` as statics; unhandled-rejection tracking; run the official `promises-aplus-tests` suite.
