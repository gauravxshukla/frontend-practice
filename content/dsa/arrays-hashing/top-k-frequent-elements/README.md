---
title: Top K Frequent Elements
type: dsa
difficulty: medium
topic: arrays-hashing
order: 5
neetcode: true
tags: [arrays, hash-map, bucket-sort, heap]
estimatedMinutes: 20
---

You get an integer array `nums` and a number `k`. Return the `k` values that appear most often in `nums`. The answer is guaranteed to be unique (there is never a tie at the cut-off), and you can return the values in any order.

```js
function topKFrequent(nums, k) // → number[]
```

## Examples

```text
Input:  nums = [1,1,1,2,2,3], k = 2
Output: [1,2]
Explanation: 1 appears three times and 2 appears twice.

Input:  nums = [7], k = 1
Output: [7]
```

## Constraints

- 1 ≤ `nums.length` ≤ 10⁵
- −10⁴ ≤ `nums[i]` ≤ 10⁴
- 1 ≤ `k` ≤ number of distinct values

## Notes

- **Identify:** "k most frequent" → count, then rank values by frequency
- **Brute force:** count, then sort the distinct values by frequency, O(n log n)
- **Better:** keep a min-heap of size k over the counts, O(n log k)
- **Insight:** a count is at most n, so bucket values by count instead of sorting
- **Steps:** count each value; buckets[c] holds values seen c times; scan buckets from high to low until k are taken
- **Complexity:** O(n log n) → O(n) time, O(n) space
- **Pitfall:** size the buckets n + 1, since one value can appear all n times
- **Related:** Kth Largest Element in an Array, K Closest Points to Origin, Group Anagrams
