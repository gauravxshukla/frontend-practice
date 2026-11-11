---
title: Two Sum II - Input Array Is Sorted
type: dsa
difficulty: medium
topic: two-pointers
order: 2
neetcode: true
tags: [arrays, two-pointers, binary-search]
estimatedMinutes: 15
---

You get an array `numbers` that is already sorted in non-decreasing order, and a `target`. Exactly one pair of different positions adds up to `target`. Return their positions as **1-based** indices `[i, j]` with `i < j`.

Use only O(1) extra space.

```js
function twoSum(numbers, target) // → [i, j] (1-based)
```

## Examples

```text
Input:  numbers = [1,2,3,4], target = 3
Output: [1,2]
Explanation: 1 + 2 = 3, at positions 1 and 2.

Input:  numbers = [2,7,11,15], target = 18
Output: [2,3]
Explanation: 7 + 11 = 18.
```

## Constraints

- 2 ≤ `numbers.length` ≤ 3 · 10⁴
- −1000 ≤ `numbers[i]` ≤ 1000
- Exactly one valid pair exists.

## Notes

- **Identify:** pair summing to target + sorted input + O(1) space → two pointers from both ends
- **Brute force:** check all pairs, O(n²)
- **Better:** binary search each number's partner, O(n log n)
- **Insight:** sorted order tells you which way to move: too small → move left up, too big → move right down
- **Steps:** l = 0, r = n − 1; compare the sum with target and move one pointer until they match
- **Complexity:** O(n²) → O(n) time, O(1) space
- **Pitfall:** the answer is 1-indexed: return [l + 1, r + 1]
- **Related:** Two Sum, 3Sum, Container With Most Water
