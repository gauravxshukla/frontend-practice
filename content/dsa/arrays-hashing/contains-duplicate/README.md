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

- **Identify:** "does any value appear twice" → hash set membership
- **Brute force:** compare every pair, O(n²)
- **Better:** sort, then compare neighbours, O(n log n) time, O(1) extra space
- **Insight:** instead of comparing pairs, remember each value in a set and check it on arrival
- **Steps:** for each num, return true if it's already in the set; otherwise add it
- **Complexity:** O(n²) → O(n) time, O(1) → O(n) space
- **Pitfall:** empty or single-element input has no duplicate, so fall through to false
- **Related:** Two Sum, Valid Anagram, Longest Consecutive Sequence
