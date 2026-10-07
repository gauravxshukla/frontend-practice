---
title: Jump Game II
type: dsa
difficulty: medium
topic: greedy
order: 3
neetcode: true
tags: [arrays, greedy, bfs]
estimatedMinutes: 20
---

You start at index `0` of `nums`. From index `i` you may jump forward by any amount from 1 up to `nums[i]`.

Return the **minimum number of jumps** needed to reach the last index. The input is guaranteed to make the last index reachable.

```js
function jump(nums) // → number
```

## Examples

```text
Input:  nums = [2,3,1,1,4]
Output: 2
Explanation: Jump 1 step to index 1, then 3 steps to the last index: 2 jumps.

Input:  nums = [2,3,0,1,4]
Output: 2
```

## Constraints

- 1 ≤ `nums.length` ≤ 10⁴
- 0 ≤ `nums[i]` ≤ 1000
- The last index is always reachable.

## Notes

- **Key insight:** think of it as BFS over indices, where each "level" is the window of indices reachable with exactly `jumps` jumps. Those windows are contiguous, so no queue is needed.
- Keep `end` (the right edge of the current level) and `farthest` (the furthest index reachable from anything in this level).
- Walk `i` from 0 to `n − 2`. Update `farthest = max(farthest, i + nums[i])`. When `i === end`, the level is used up: `jumps++` and `end = farthest`.
- Stop the loop at `n − 2`. Including the last index would count a jump you never need to take.
- O(n) time, O(1) space.
- Brute force: DP `dp[j] = min(dp[i] + 1)` over every `i` that can reach `j`, O(n · max(nums)), or O(n²).
- Edge case: a single-element array needs 0 jumps.
- Follow-up: return the actual indices you land on. Record which `i` produced `farthest` for each level.
