---
title: Promise.all
type: js
difficulty: medium
tags: [promises, async, polyfill]
estimatedMinutes: 20
---

Implement `promiseAll(iterable)`, which behaves like `Promise.all()`.

- Returns a promise that resolves to an array of results **in the same order** as the input, regardless of which settles first.
- Rejects as soon as **any** input rejects, with that reason.
- Input items may be plain values (non-promises); treat them as already resolved.
- An empty input resolves to `[]` immediately.

## Examples

```js
await promiseAll([1, Promise.resolve(2), new Promise((r) => setTimeout(() => r(3), 10))]); // [1, 2, 3]
await promiseAll([Promise.resolve(1), Promise.reject('boom')]); // rejects with 'boom'
```

## Notes

- Keep a `remaining` counter rather than checking `results.length`: with a sparse array, the length is set up front.
- Write results by **index**, not by `push`, to keep the input order.
- `await` (or `Promise.resolve(item)`) normalises non-promise values.
- Follow-ups: `Promise.allSettled`, `Promise.any`, `Promise.race`. Also try it with a concurrency limit.
