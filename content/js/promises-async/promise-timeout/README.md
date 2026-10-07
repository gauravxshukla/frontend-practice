---
title: Promise Timeout
type: js
difficulty: medium
topic: promises-async
order: 8
tags: [promises, async, timers]
estimatedMinutes: 15
---

Implement `promiseTimeout(promiseOrFn, ms)`. It returns a promise that settles like the given one, unless that takes longer than `ms`.

- `promiseOrFn` is either a promise (or plain value) or a function returning one. If it is a function, call it once, right away.
- If the input settles within `ms`, pass its result through: resolve with its value, or reject with its reason.
- If it hasn't settled after `ms`, reject with an `Error` whose message is exactly `'Timeout'`. A later settle of the input is ignored.
- When the input settles first, **clear the timer** with `clearTimeout`, so no stray timer keeps running.
- If calling `promiseOrFn` throws synchronously, reject with that error.

```js
const slow = new Promise((r) => setTimeout(() => r('late'), 100));
await promiseTimeout(slow, 20); // rejects with Error('Timeout')

await promiseTimeout(() => fetchUser(1), 1000); // resolves with the user, if it is quick enough
```

**Constraints:** the timeout error must be an `Error` instance with `message === 'Timeout'`. Don't wait for a slow input to finish before rejecting.

## Notes

- **Approach:** create the outer promise, start `setTimeout(() => reject(new Error('Timeout')), ms)`, and attach `then(value => { clearTimeout(t); resolve(value) }, reason => { clearTimeout(t); reject(reason) })` to `Promise.resolve(input)`.
- **Why the race is safe:** whichever of the timer and the input calls first wins; the loser's `resolve`/`reject` call is a no-op.
- **Alternative:** `Promise.race([input, timeoutPromise])` plus `finally(() => clearTimeout(t))`. Without the `clearTimeout`, the timer still fires later and, in Node, keeps the process alive.
- **Pitfall:** a timeout does **not** cancel the underlying work. To really stop a `fetch`, pass an `AbortSignal` (`AbortSignal.timeout(ms)`).
- **Complexity:** O(1).
- **Follow-ups:** a custom error class (`TimeoutError`) so callers can tell timeouts apart, abort support, or a `withTimeout(fn, ms)` wrapper that returns a new function.
