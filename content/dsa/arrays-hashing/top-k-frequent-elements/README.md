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

- Step 1 is always the same: count frequencies with a `Map`.
- **Sort baseline:** sort the distinct values by count and take the first k. O(n log n).
- **Heap:** keep a min-heap of size k keyed by count. Push each value and pop when the size exceeds k. O(n log k), which is best when k is small.
- **Bucket sort (optimal):** a count can be at most `n`, so make `buckets[count] = [values…]`. Walk the buckets from high to low until you have collected k values. O(n) time and O(n) space.
- Pitfall: using an object as the counter turns keys into strings, so you'd return `"1"` instead of `1`. Use a `Map`, or convert back with `Number`.
- Pitfall: stop as soon as you have k values, even in the middle of a bucket.
- Follow-up: for a stream of numbers, keep the counts and a size-k heap, or use a Count-Min sketch when memory is tight.
