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

- **Key insight:** you never need to know *which* path you took, only the furthest index reachable so far.
- Sweep left to right keeping `reach`. If `i > reach`, index `i` is unreachable and so is everything after it: return `false`. Otherwise `reach = max(reach, i + nums[i])`.
- Equivalent backwards greedy: keep a `goal` starting at the last index, and move it to `i` whenever `i + nums[i] ≥ goal`. Answer is `goal === 0`.
- O(n) time, O(1) space.
- Brute force: DP marking each reachable index and fanning out up to `nums[i]` steps, O(n · max(nums)). Plain recursion without memo is exponential.
- Edge cases: a single element is already at the end (`[0]` → true). A zero is only fatal if you can't jump over it.
- You can return early once `reach ≥ n − 1`.
- Follow-up: Jump Game II asks for the minimum number of jumps.
