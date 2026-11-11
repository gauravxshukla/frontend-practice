---
title: 3Sum
type: dsa
difficulty: medium
topic: two-pointers
order: 3
neetcode: true
tags: [arrays, two-pointers, sorting]
estimatedMinutes: 25
---

You get an integer array `nums`. Return every **distinct** triplet of values `[a, b, c]`, taken from three different positions, where `a + b + c = 0`.

The same triplet of values must not appear twice. The triplets can come back in any order, and so can the values inside each triplet. If there are none, return `[]`.

```js
function threeSum(nums) // → number[][]
```

## Examples

```text
Input:  nums = [-1,0,1,2,-1,-4]
Output: [[-1,0,1],[-1,-1,2]]

Input:  nums = [0,1,1]
Output: []

Input:  nums = [0,0,0]
Output: [[0,0,0]]
```

## Constraints

- 3 ≤ `nums.length` ≤ 3000
- −10⁵ ≤ `nums[i]` ≤ 10⁵

## Notes

- **Identify:** all unique triplets summing to 0 → sort, fix one number, two-pointer the rest
- **Brute force:** three nested loops plus a set to drop duplicate triplets, O(n³)
- **Better:** fix i, then a hash set finds the third number, O(n²) time but messy dedupe
- **Insight:** after sorting, each fixed nums[i] turns the rest into Two Sum II on a sorted range
- **Steps:** sort; for each i (skip repeats), l = i + 1, r = end; move by sum; on a hit, skip repeats on both sides
- **Complexity:** O(n³) → O(n²) time, O(1) extra space besides sorting and output
- **Pitfall:** skip duplicate values for i, l and r, or the same triplet appears more than once
- **Related:** Two Sum, Two Sum II, Container With Most Water
