---
title: Partition Equal Subset Sum
type: dsa
difficulty: medium
topic: 1d-dp
order: 12
neetcode: true
tags: [dynamic-programming, knapsack, arrays]
estimatedMinutes: 25
---

Given an array of positive integers, decide whether it can be split into **two groups with equal sums**. Every element goes into exactly one group. Return `true` or `false`.

```js
function canPartition(nums) // → boolean
```

## Examples

```text
Input:  nums = [1,5,11,5]
Output: true
Explanation: [1, 5, 5] and [11] both sum to 11.

Input:  nums = [1,2,3,5]
Output: false
Explanation: The total 11 is odd.
```

## Constraints

- 1 ≤ `nums.length` ≤ 200
- 1 ≤ `nums[i]` ≤ 100

## Notes

- **Key insight:** two equal halves means one group sums to `total / 2`. If `total` is odd the answer is immediately `false`; otherwise this is a subset-sum question.
- **Recurrence (0/1 knapsack):** `can(i, s)` = some subset of the first `i` numbers sums to `s`. `can(0, 0) = true`, and `can(i, s) = can(i - 1, s) OR (s ≥ nums[i-1] AND can(i - 1, s - nums[i-1]))`.
- **2-D table:** O(n · target) time and space.
- **Space optimisation:** row `i` reads only row `i - 1`, so keep one boolean array and sweep `s` from `target` **down** to `nums[i]`. Sweeping upward would reuse the same number twice. O(n · target) time, O(target) space.
- Stop early once `reachable[target]` turns true.
- **Brute force:** try all 2ⁿ assignments of elements to the two groups.
- Alternative: a `Set` of reachable sums (or a BigInt bitset with `bits |= bits << n`) gives the same result.
- Edge cases: a single element → false, two equal elements → true, one element larger than half the total → false.
- Follow-up: split into `k` equal groups (Partition to K Equal Sum Subsets, backtracking with bitmask memo).
