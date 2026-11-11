---
title: Kth Largest Element in an Array
type: dsa
difficulty: medium
topic: heap
order: 4
neetcode: true
tags: [arrays, heap, quickselect, sorting]
estimatedMinutes: 20
---

Given an integer array `nums` and an integer `k`, return the **k-th largest** value. This means the k-th position when the array is sorted in descending order, so duplicates each count (`[3,3,1]` has 3 as both its 1st and 2nd largest).

Try to do better than fully sorting the array.

```js
function findKthLargest(nums, k) // → number
```

## Examples

```text
Input:  nums = [3,2,1,5,6,4], k = 2
Output: 5

Input:  nums = [3,2,3,1,2,4,5,5,6], k = 4
Output: 4
Explanation: sorted descending: 6,5,5,4,… so the 4th value is 4.
```

## Constraints

- 1 ≤ `k` ≤ `nums.length` ≤ 10⁵
- −10⁴ ≤ `nums[i]` ≤ 10⁴

## Notes

- **Identify:** k-th largest in an unsorted array → min-heap of size k (or quickselect)
- **Brute force:** sort descending and take index k − 1, O(n log n)
- **Insight:** only the k largest matter; keep them in a min-heap so the smallest of them sits on top
- **Steps:** push each number; pop when the heap exceeds k; the top is the k-th largest
- **Complexity:** O(n log n) → O(n log k) time, O(k) space (quickselect: O(n) average, O(n²) worst)
- **Pitfall:** duplicates count separately: [7, 7, 7], k = 2 is 7
- **Related:** Kth Largest Element in a Stream, K Closest Points to Origin, Top K Frequent Elements
