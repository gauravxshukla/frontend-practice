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

- **Key insight:** because the array is sorted, the sum of the two ends tells you which pointer to move.
- Start with `left = 0`, `right = n - 1`. If the sum is too small, `left++`. If it's too big, `right--`. If it matches, return `[left + 1, right + 1]`.
- Why it's safe: when the sum is too small, `numbers[left]` can't pair with anything (everything else is ≤ `numbers[right]`), so discarding it loses nothing.
- O(n) time and O(1) space.
- **Alternatives:** a hash map as in Two Sum is O(n) time but O(n) space, which breaks the space rule. Binary-searching the complement for each element is O(n log n).
- Pitfall: returning 0-based indices. The answer here is 1-based.
- Pitfall: duplicates such as `[5,5]` with target 10. The pointers must be different positions, which `left < right` guarantees.
- Follow-up: 3Sum reuses this exact loop as its inner step.
