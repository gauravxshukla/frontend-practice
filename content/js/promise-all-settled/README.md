---
title: Promise.allSettled
type: js
difficulty: medium
tags: [promises, async, polyfill]
estimatedMinutes: 15
---

Implement `promiseAllSettled(iterable)`, which behaves like `Promise.allSettled()`.

- Waits for **every** input to settle. It never rejects.
- Resolves to an array, in input order, of `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`.
- Plain values count as fulfilled. Empty input resolves to `[]`.

```js
await promiseAllSettled([1, Promise.reject('x')]);
// [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'x' }]
```

## Notes

- Same skeleton as `Promise.all`: an index-addressed results array plus a pending counter. The difference is that the `catch` records the reason instead of rejecting.
- Decrement the counter in **both** branches. Checking it after `try/catch` keeps that in one place.
