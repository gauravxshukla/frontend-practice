---
title: Jump Game
type: dsa
difficulty: medium
topic: greedy
order: 2
neetcode: true
tags: [arrays, greedy, dynamic-programming]
estimatedMinutes: 15
---

You stand on index `0` of an array `nums`. Each value `nums[i]` is the **maximum** number of steps you may jump forward from index `i` (you can jump any amount from 0 up to that number).

Return `true` if you can reach the last index, otherwise `false`.

```js
function canJump(nums) // → boolean
```

## Examples

```text
Input:  nums = [2,3,1,1,4]
Output: true
Explanation: Jump 1 step to index 1, then 3 steps to the end.

Input:  nums = [3,2,1,0,4]
Output: false
Explanation: Every path lands on index 3, whose value is 0, so index 4 is unreachable.
```

## Constraints

- 1 ≤ `nums.length` ≤ 10⁴
- 0 ≤ `nums[i]` ≤ 10⁵

## Notes

- **Identify:** can you reach the last index with jumps up to nums[i] → track the farthest reachable index
- **Brute force:** try every jump length from every index recursively, exponential
- **Better:** DP: good[i] if some j > i within reach is good, O(n²)
- **Insight:** you never need the exact path; only the farthest index reachable so far matters
- **Steps:** reach = 0; for each i: if i > reach return false; reach = max(reach, i + nums[i])
- **Complexity:** exponential → O(n) time, O(1) space
- **Pitfall:** a 0 is only a trap if nothing earlier jumps past it ([2, 0, 0] is true)
- **Related:** Jump Game II, Gas Station, Maximum Subarray
