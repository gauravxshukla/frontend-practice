---
title: mapAsync
type: js
difficulty: medium
tags: [promises, async]
estimatedMinutes: 15
---

Implement `mapAsync(iterable, callbackFn)`. `callbackFn` returns a promise. Call it for every element **in parallel**, and resolve to the array of results **in input order**. If any call rejects, reject with that reason.

```js
const double = (n) => new Promise((r) => setTimeout(() => r(n * 2), Math.random() * 20));
await mapAsync([1, 2, 3], double); // [2, 4, 6]
```

## Notes

- **Bug in the original version:** it resolved when the *last index* finished (`index === len - 1`), not when *every* item finished. If item 2 resolved before item 0, you got a result with holes. Count completions instead.
- This is `Promise.all(iterable.map(callbackFn))`. Being able to say so is worth a mention in the interview.
- Follow-up: `mapAsyncLimit(iterable, callbackFn, size)` with a concurrency limit.
