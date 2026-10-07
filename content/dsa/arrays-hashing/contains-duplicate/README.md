---
title: Contains Duplicate
type: dsa
difficulty: easy
topic: arrays-hashing
order: 1
neetcode: true
tags: [arrays, hash-set]
estimatedMinutes: 5
---

Return `true` if any value appears at least twice in the array, otherwise `false`.

```js
containsDuplicate([1, 2, 3, 1]); // true
containsDuplicate([1, 2, 3, 4]); // false
```

## Notes

- Use a `Set` and return early on the first repeat. O(n) time and space.
- One-liner: `new Set(nums).size !== nums.length`. It's clean, but always scans everything.
- If O(1) extra space is required: sort and compare neighbours, O(n log n).
