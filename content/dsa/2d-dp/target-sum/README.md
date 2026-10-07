---
title: Target Sum
type: dsa
difficulty: medium
topic: 2d-dp
order: 5
neetcode: true
tags: [dynamic-programming, knapsack, backtracking]
estimatedMinutes: 25
---

Put a `+` or a `-` sign in front of **every** number in `nums`, then add everything up. Return how many of the 2ⁿ sign assignments make the result equal `target`. Assignments are counted by position, so equal numbers at different indices give different assignments.

```js
function findTargetSumWays(nums, target) // → number
```

## Examples

```text
Input:  nums = [1,1,1,1,1], target = 3
Output: 5
Explanation: Make exactly one of the five 1s negative: 5 ways.

Input:  nums = [1], target = 1
Output: 1
```

## Constraints

- 1 ≤ `nums.length` ≤ 20
- 0 ≤ `nums[i]` ≤ 1000, and `sum(nums)` ≤ 1000
- −1000 ≤ `target` ≤ 1000

## Notes

- **Direct DP:** `ways(i, s)` = assignments of the first `i` numbers that sum to `s`. `ways(0, 0) = 1` and `ways(i, s) = ways(i - 1, s - nums[i-1]) + ways(i - 1, s + nums[i-1])`. Offset `s` by `total` to index an array. O(n · total) time, O(total) space with two rolling rows.
- **Subset-sum reduction (optimal):** let `P` be the numbers with `+`. Then `sum(P) - (total - sum(P)) = target`, so `sum(P) = (total + target) / 2`. Count the subsets with that sum.
- If `total + target` is odd, or `|target| > total`, the answer is 0.
- **Subset-count recurrence:** `count(i, s) = count(i - 1, s) + count(i - 1, s - nums[i-1])`. Collapse to one array swept with `s` **downward** so each number is used once. O(n · goal) time, O(goal) space.
- Zeros are handled automatically. Each `0` doubles the count, because `+0` and `-0` are different assignments.
- **Brute force:** DFS over all 2ⁿ sign choices. With `n ≤ 20` that is about 10⁶ leaves, which is fine here but does not scale.
- Pitfall: a memo key like `` `${i},${s}` `` in a `Map` is correct but much slower than an offset array.
- Follow-up: list the actual sign assignments (backtracking guided by the count table).
