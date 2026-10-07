---
title: House Robber II
type: dsa
difficulty: medium
topic: 1d-dp
order: 4
neetcode: true
tags: [dynamic-programming, arrays]
estimatedMinutes: 20
---

Same rules as House Robber (never rob two neighbouring houses), but now the houses sit in a **circle**: the first house and the last house are neighbours too. `nums[i]` is the cash in house `i`. Return the largest total you can collect.

```js
function rob(nums) // → number
```

## Examples

```text
Input:  nums = [2,3,2]
Output: 3
Explanation: Houses 0 and 2 are neighbours in the circle, so the best is house 1 alone.

Input:  nums = [1,2,3,1]
Output: 4
Explanation: Rob houses 0 and 2: 1 + 3 = 4.

Input:  nums = [1,2,3]
Output: 3
```

## Constraints

- 1 ≤ `nums.length` ≤ 100
- 0 ≤ `nums[i]` ≤ 1000

## Notes

- **Key insight:** in any valid plan, house `0` and house `n - 1` are not both robbed. So the answer is the better of two straight-line problems: houses `0..n-2` and houses `1..n-1`.
- **Recurrence (per line):** `best(i) = max(best(i - 1), best(i - 2) + nums[i])`, exactly as in House Robber.
- **Space optimisation:** each line pass uses two rolling variables, so the whole thing is O(n) time and O(1) space.
- **Brute force:** enumerate subsets and reject any with adjacent indices, treating `0` and `n - 1` as adjacent. O(2ⁿ · n).
- Edge case: `n = 1`. Both ranges would be empty, yet the single house can be robbed. Handle it before splitting.
- Edge case: `n = 2`. You may rob only one of them, so the answer is the max.
- Pitfall: running one linear pass on the whole array and "fixing" the ends afterwards. It double-counts when both ends looked attractive.
- Follow-up: return which houses were robbed (store a choice per index and backtrack for the winning range).
