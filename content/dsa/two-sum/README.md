---
title: Two Sum
type: dsa
difficulty: easy
tags: [arrays, hash-map, blind75]
estimatedMinutes: 10
---

Given an array of numbers and a `target`, return the **indices** `[i, j]` (with `i < j`) of the two numbers that add up to `target`. Exactly one solution exists, and you may not use the same element twice.

```js
twoSum([2, 7, 11, 15], 9); // [0, 1]
twoSum([3, 2, 4], 6);      // [1, 2]
```

## Notes

- One pass with a hash map from value to index: for each `n`, check whether `target - n` was seen, otherwise record `n`.
- O(n) time, O(n) space. The brute-force double loop is O(n²).
- Check for the complement **before** inserting the current number, which handles `[3, 3], 6` correctly.
- Prefer `Map`/`Object.hasOwn` over `obj.hasOwnProperty` (which can be shadowed).
