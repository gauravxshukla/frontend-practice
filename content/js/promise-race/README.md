---
title: Promise.race
type: js
difficulty: easy
tags: [promises, async, polyfill]
estimatedMinutes: 10
---

Implement `promiseRace(iterable)`, which behaves like `Promise.race()`. It settles the same way as the **first** input to settle, whether that input fulfils or rejects.

- Plain values count as already-fulfilled promises.
- An empty input returns a promise that stays pending forever.

```js
await promiseRace([delay('slow', 50), delay('fast', 10)]); // 'fast'
```

## Notes

- `Promise.resolve(item).then(resolve, reject)` for each item. Settling a promise more than once is a no-op, so the first one wins automatically.
- A typical use is a timeout: `promiseRace([fetch(url), rejectAfter(5000)])`.
