---
title: Find the Duplicate Number
type: dsa
difficulty: medium
topic: linked-list
order: 8
neetcode: true
tags: [arrays, fast-slow-pointers, cycle-detection]
estimatedMinutes: 25
---

You get an array `nums` of `n + 1` integers where every value is between `1` and `n` inclusive. Exactly one value is repeated (it may appear two or more times); return that value.

The challenge: **don't modify** `nums`, and use only O(1) extra space.

```js
function findDuplicate(nums) // → number
```

## Examples

```text
Input:  nums = [1,3,4,2,2]
Output: 2

Input:  nums = [3,1,3,4,2]
Output: 3

Input:  nums = [3,3,3,3,3]
Output: 3
```

## Constraints

- 1 ≤ n ≤ 10⁵, and `nums.length === n + 1`
- 1 ≤ `nums[i]` ≤ n
- Exactly one value repeats, possibly many times.

## Notes

- **Identify:** n + 1 values in 1..n, O(1) space, can't modify → treat i → nums[i] as a linked list with a cycle
- **Brute force:** sort a copy or use a set, O(n log n) time or O(n) space
- **Insight:** the duplicate value is where two indices point, i.e. the entrance of the cycle, so use Floyd
- **Steps:** slow/fast until they meet; restart one at 0; step both by one; they meet at the duplicate
- **Complexity:** O(n log n) → O(n) time, O(n) → O(1) space
- **Pitfall:** phase 2 must move both pointers one step at a time from 0 and the meeting point
- **Related:** Linked List Cycle, Missing Number, Contains Duplicate
