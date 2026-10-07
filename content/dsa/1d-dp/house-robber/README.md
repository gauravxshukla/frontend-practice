---
title: House Robber
type: dsa
difficulty: medium
topic: 1d-dp
order: 3
neetcode: true
tags: [dynamic-programming, arrays]
estimatedMinutes: 15
---

Houses stand in a row and `nums[i]` is the cash in house `i`. You may rob any set of houses as long as you **never rob two neighbouring houses**. Return the largest total you can collect.

```js
function rob(nums) // → number
```

## Examples

```text
Input:  nums = [1,2,3,1]
Output: 4
Explanation: Rob houses 0 and 2: 1 + 3 = 4.

Input:  nums = [2,7,9,3,1]
Output: 12
Explanation: Rob houses 0, 2 and 4: 2 + 9 + 1 = 12.
```

## Constraints

- 1 ≤ `nums.length` ≤ 100
- 0 ≤ `nums[i]` ≤ 400

## Notes

- **Key insight:** for house `i` there are only two choices. Skip it and keep the best answer for the first `i - 1` houses, or rob it and add it to the best answer for the first `i - 2` houses.
- **Recurrence:** `best(i) = max(best(i - 1), best(i - 2) + nums[i])`, with `best(-1) = best(-2) = 0`.
- **Bottom-up table:** O(n) time, O(n) space.
- **Space optimisation:** two rolling variables (`skipPrev`, `takePrev`). O(n) time, O(1) space.
- **Brute force:** try every subset with no two adjacent indices. That is O(2ⁿ) (the number of valid subsets is itself Fibonacci-sized).
- Greedy "take every other house" fails: `[2, 1, 1, 2]` is best robbed at indices 0 and 3 for 4.
- Edge cases: a single house (rob it), all zeros, and one huge house next to two medium ones.
- Follow-up: the houses form a circle (House Robber II), or a binary tree (House Robber III, DFS returning a `[rob, skip]` pair).
