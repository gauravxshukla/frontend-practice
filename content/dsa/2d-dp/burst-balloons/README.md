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

- **Key insight:** think about the balloon burst **last** in a range, not first. If `k` is the last one popped between walls `l` and `r`, its neighbours at that moment are exactly `l` and `r`, and the two sides `(l, k)` and `(k, r)` are independent subproblems.
- Pad the array with a `1` at each end so the walls always exist.
- **Recurrence (interval DP):** `best(l, r) = max over l < k < r of best(l, k) + vals[l]·vals[k]·vals[r] + best(k, r)`, with `best(l, l + 1) = 0` (nothing between). The answer is `best(0, n + 1)`.
- Fill by increasing interval length so both halves are ready. O(n³) time, O(n²) space.
- No space reduction applies. Interval DP needs arbitrary sub-intervals, so the full table stays.
- **Brute force:** try every burst order. O(n!) (or O(n · 2ⁿ) with a bitmask memo), only usable for about 10 balloons.
- Why "first burst" fails: choosing the first balloon changes who is adjacent to whom, so the sides are not independent.
- Edge cases: a single balloon → its value; zeros make some bursts worthless but can still be good to pop early.
- Follow-up: Minimum Cost to Merge Stones and Matrix Chain Multiplication use the same "split point" interval DP.
