---
title: Burst Balloons
type: dsa
difficulty: hard
topic: 2d-dp
order: 10
neetcode: true
tags: [dynamic-programming, interval-dp, arrays]
estimatedMinutes: 40
---

Balloons are lined up and `nums[i]` is the number painted on balloon `i`. When you burst a balloon you earn `left × it × right` coins, where `left` and `right` are the numbers on its **current** neighbours (a missing neighbour past either end counts as `1`). After a burst, its two neighbours become adjacent. Burst every balloon in whatever order you choose and return the **maximum** coins you can collect.

```js
function maxCoins(nums) // → number
```

## Examples

```text
Input:  nums = [3,1,5,8]
Output: 167
Explanation: Burst 1, 5, 3, 8 in that order: 3·1·5 + 3·5·8 + 1·3·8 + 1·8·1 = 167.

Input:  nums = [1,5]
Output: 10
```

## Constraints

- 1 ≤ `nums.length` ≤ 300
- 0 ≤ `nums[i]` ≤ 100

## Notes

- **Identify:** order of bursting changes neighbours, maximise coins → interval DP on the last balloon burst
- **Key formula:** dp[l][r] = max over k in (l, r) of dp[l][k] + vals[l]·vals[k]·vals[r] + dp[k][r]
- **Brute force:** try every bursting order, O(n!)
- **Insight:** choose the balloon burst last in an interval; its neighbours are then the fixed interval ends
- **Steps:** pad with 1 at both ends; for widening intervals (l, r), try every last k; answer dp[0][n + 1]
- **Complexity:** O(n!) → O(n³) time, O(n²) space
- **Pitfall:** thinking about the first burst makes subproblems depend on each other; think about the last one
- **Related:** Partition Equal Subset Sum, Longest Common Subsequence, Edit Distance
