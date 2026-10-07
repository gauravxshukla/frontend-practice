---
title: sleep
type: js
difficulty: easy
topic: promises-async
order: 1
tags: [promises, async, timers]
estimatedMinutes: 5
---

Implement `sleep(ms)`. It returns a promise that resolves after roughly `ms` milliseconds, so async code can pause with `await sleep(ms)`.

- The promise resolves with `undefined`; it never rejects.
- It is always asynchronous: even `sleep(0)` resolves **after** the current synchronous code has finished.
- Each call is independent; several sleeps can run at the same time.

```js
console.log('start');
await sleep(100); // about 100 ms later...
console.log('done');

sleep(0).then(() => console.log('second'));
console.log('first'); // logs "first", then "second"
```

**Constraints:** return a real `Promise`. Timers are not exact, so "about `ms`" means "not noticeably earlier than `ms`".

## Notes

- **Approach:** `new Promise((resolve) => setTimeout(resolve, ms))`. Passing `resolve` directly means it is called with no arguments, so the value is `undefined`.
- **Why `sleep(0)` is still async:** `setTimeout` callbacks are macrotasks, and `then` callbacks are always queued, so nothing runs before the current call stack unwinds.
- **Pitfall:** `setTimeout(resolve(), ms)` calls `resolve` immediately. Pass the function, don't call it.
- **Complexity:** O(1).
- **Follow-ups:** resolve with a value (`sleep(ms, value)`), make it cancellable with an `AbortSignal`, or explain why `setTimeout` can fire late (clamping, a busy main thread, background tabs).
