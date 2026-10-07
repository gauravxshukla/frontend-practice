---
title: Promise Merge
type: js
difficulty: medium
topic: promises-async
order: 13
tags: [promises, async, types]
estimatedMinutes: 15
---

Implement `promiseMerge(p1, p2)`. Wait for both promises, then resolve with their results merged according to type:

| Both results are | Merged result |
| --- | --- |
| numbers | their sum: `a + b` |
| strings | concatenation: `a + b` |
| arrays | a new array: `[...a, ...b]` |
| plain objects | a shallow merge: `{ ...a, ...b }` (keys from `p2` win) |

- Any other combination (mismatched types such as a number and a string, an array and an object, or unsupported types such as booleans or `null`) rejects with a `TypeError` whose message is `'Unsupported data types'`.
- If either promise rejects, reject with that error.
- `p1` and `p2` may also be plain values.
- Don't mutate the input arrays or objects.

```js
await promiseMerge(Promise.resolve(1), Promise.resolve(2)); // 3
await promiseMerge(Promise.resolve({ a: 1 }), Promise.resolve({ b: 2 })); // { a: 1, b: 2 }
await promiseMerge(Promise.resolve(1), Promise.resolve('1')); // rejects with TypeError('Unsupported data types')
```

**Constraints:** a "plain object" is one created by an object literal (`{}`) or `Object.create(null)`. Arrays are not plain objects.

## Notes

- **Approach:** `const [a, b] = await Promise.all([p1, p2])`, then branch on type. `Promise.all` also gives you "reject if either rejects" for free, and runs both in parallel.
- **Type checks:** `typeof` for numbers and strings, `Array.isArray` for arrays, and for plain objects `Object.getPrototypeOf(x)` being `Object.prototype` or `null`. Check arrays **before** objects, since `typeof [] === 'object'`.
- **Pitfall:** `typeof null === 'object'`, so a naive object check would accept `null`.
- **Pitfall:** `a.push(...b)` or `Object.assign(a, b)` mutates the first result. Build new values.
- **Complexity:** O(n + m) for arrays and objects, O(1) otherwise.
- **Follow-ups:** deep-merge objects, accept any number of promises (`reduce` over the results), or merge `Map`s and `Set`s.
