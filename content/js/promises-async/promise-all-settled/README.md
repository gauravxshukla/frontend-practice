---
title: Promise.allSettled
type: js
difficulty: medium
topic: promises-async
order: 3
tags: [promises, async, polyfill]
estimatedMinutes: 15
---

Implement `promiseAllSettled(iterable)`, which behaves like `Promise.allSettled()`. Export it as `export default function promiseAllSettled(iterable)`. Don't use the native `Promise.allSettled`.

- Waits for **every** input to settle. It **never rejects**, even if every input rejects.
- Resolves to an array **in input order** (not settle order) where each entry is exactly `{ status: 'fulfilled', value }` or `{ status: 'rejected', reason }`. No other keys.
- Plain values (non-promises) count as fulfilled.
- An empty input resolves to `[]`.

```js
await promiseAllSettled([1, Promise.reject('x')]);
// [{ status: 'fulfilled', value: 1 }, { status: 'rejected', reason: 'x' }]

await promiseAllSettled([Promise.reject(1), Promise.reject(2)]);
// [{ status: 'rejected', reason: 1 }, { status: 'rejected', reason: 2 }]
```

**Constraints:** the input is an array. Always return a `Promise`. Rejection reasons are passed through unchanged (the same `Error` object, or `undefined`).

## Notes

- **Approach:** the `Promise.all` skeleton (an index-addressed `results` array plus a `pending` counter), except the rejection handler **records** `{ status: 'rejected', reason }` instead of rejecting the outer promise.
- **Decrement in both branches:** doing it after the `try/catch` (or in both `then` handlers) keeps it in one place. Forgetting it in the rejection branch means the promise never resolves.
- **Empty input:** resolve `[]` up front, otherwise nothing ever decrements the counter.
- **Order:** write `results[index]`, never `push`.
- **Complexity:** O(n) work and memory.
- **Follow-ups:** build `allSettled` from `Promise.all` by mapping each input to `p.then(value => ({...}), reason => ({...}))`. When would you choose it over `all`? (Batch requests where partial failure is acceptable, such as a dashboard loading independent widgets.)
