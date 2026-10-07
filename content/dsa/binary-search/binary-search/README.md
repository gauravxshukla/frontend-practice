---
title: Binary Search
type: dsa
difficulty: easy
topic: binary-search
order: 1
neetcode: true
tags: [arrays, binary-search]
estimatedMinutes: 10
---

You get an array `nums` of **distinct** integers sorted in ascending order, and a `target`. Return the index where `target` sits, or `-1` if it isn't in the array.

Your solution should run in O(log n) time, so a linear scan doesn't count.

```js
function search(nums, target) // → number
```

## Examples

```text
Input:  nums = [-1,0,3,5,9,12], target = 9
Output: 4

Input:  nums = [-1,0,3,5,9,12], target = 2
Output: -1
Explanation: 2 never appears, so the answer is -1.
```

## Constraints

- 1 ≤ `nums.length` ≤ 10⁴
- −10⁴ < `nums[i]`, `target` < 10⁴
- All values in `nums` are distinct and sorted ascending.

## Notes

- **Key insight:** comparing `target` with the middle element tells you which half can't contain it, so you discard half the array every step.
- Keep two pointers `lo = 0`, `hi = n - 1`, loop while `lo <= hi`, and compute `mid = lo + ((hi - lo) >> 1)`.
- If `nums[mid]` equals `target` return `mid`. If it's smaller, move `lo = mid + 1`, otherwise `hi = mid - 1`.
- O(log n) time, O(1) space. The brute force is a linear scan in O(n).
- Pitfall: mixing `while (lo < hi)` with `hi = mid - 1` skips the last candidate. Pick one interval convention (closed `[lo, hi]` here) and stick to it.
- Pitfall: `lo = mid` instead of `lo = mid + 1` can loop forever when `hi = lo + 1`.
- `(lo + hi) / 2` overflows in fixed-width languages. JS numbers don't overflow here, but interviewers like to hear you know it.
- Follow-up: return the insertion position when the target is missing (lower bound), or the first/last index when duplicates are allowed.
