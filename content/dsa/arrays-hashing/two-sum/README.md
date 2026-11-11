---
title: Two Sum
type: dsa
difficulty: easy
topic: arrays-hashing
order: 3
neetcode: true
tags: [arrays, hash-map]
estimatedMinutes: 10
---

Given an array of numbers and a `target`, return the **indices** `[i, j]` (with `i < j`) of the two numbers that add up to `target`. Exactly one solution exists, and you may not use the same element twice.

```js
twoSum([2, 7, 11, 15], 9); // [0, 1]
twoSum([3, 2, 4], 6);      // [1, 2]
```

## Notes

- **Identify:** pair + sum to target + unsorted → hash map
- **Brute force:** check all pairs, O(n²)
- **Insight:** don't search for the partner; remember what you've seen
- **Steps:** for each num, if `target − num` is in the map, return both indices; else store num → index
- **Complexity:** O(n²) → O(n) time, O(1) → O(n) space
- **Pitfall:** check before storing, so a number never pairs with itself ([3], target 6)
- **Related:** Contains Duplicate, Two Sum II, 3Sum
