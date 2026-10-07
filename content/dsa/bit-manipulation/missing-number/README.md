---
title: Missing Number
type: dsa
difficulty: easy
topic: bit-manipulation
order: 5
neetcode: true
tags: [arrays, bit-manipulation, math]
estimatedMinutes: 10
---

You get an array `nums` of `n` **distinct** numbers, all taken from the range `0` to `n` (inclusive). That range has `n + 1` values, so exactly one is missing. Return it.

Aim for O(n) time and O(1) extra space.

```js
function missingNumber(nums) // → number
```

## Examples

```text
Input:  nums = [3,0,1]
Output: 2
Explanation: n = 3, so the range is 0..3 and 2 is missing.

Input:  nums = [0,1]
Output: 2
Explanation: n = 2, so the range is 0..2 and 2 is missing.

Input:  nums = [9,6,4,2,3,5,7,0,1]
Output: 8
```

## Constraints

- 1 ≤ n = `nums.length` ≤ 10⁴
- 0 ≤ `nums[i]` ≤ n
- All values are distinct

## Notes

- **Key insight (XOR):** XOR all indices `0..n` together with all values. Every present number appears twice and cancels; the missing one is left.
- Start with `result = n`, then for each `i`: `result ^= i ^ nums[i]`.
- **Sum alternative:** `n(n + 1)/2 − sum(nums)`. Just as fast; in fixed-width languages it could overflow for large n, which XOR never does.
- O(n) time, O(1) space for both.
- Baselines: a `Set` lookup for each of `0..n` (O(n) space), or sort and find the first `i` with `nums[i] !== i` (O(n log n)).
- Edge cases: the missing number is `0` (e.g. `[1]`) or `n` itself (e.g. `[0, 1]`). The sort approach often forgets the second one.
- Follow-up: First Missing Positive, where values can be anything and you must use the array itself as a hash table.
