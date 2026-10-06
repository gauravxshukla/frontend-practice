---
title: Promise.withResolvers
type: js
difficulty: easy
tags: [promises, async, polyfill]
estimatedMinutes: 5
---

Implement `promiseWithResolvers()`, which behaves like `Promise.withResolvers()`. It returns `{ promise, resolve, reject }`, so the promise can be settled from outside its executor.

```js
const { promise, resolve } = promiseWithResolvers();
setTimeout(() => resolve('done'), 100);
await promise; // 'done'
```

## Notes

- The executor runs **synchronously** inside `new Promise(...)`, so `resolve`/`reject` are already assigned when the constructor returns.
- This "deferred" pattern is handy for request queues, event-to-promise adapters and tests.
