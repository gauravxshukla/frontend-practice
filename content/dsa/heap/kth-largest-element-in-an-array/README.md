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

- **Key insight:** you don't need full order, only the boundary between the top k and the rest.
- **Min-heap of size k:** push every value and pop whenever the size exceeds k. The heap root is the k-th largest. O(n log k) time, O(k) space.
- **Quickselect:** partition like quicksort but only recurse into the side that contains index `n − k`. O(n) average time, O(1) extra space, O(n²) worst case (randomise the pivot to avoid it).
- Brute force: sort descending and return `nums[k − 1]`. O(n log n), the baseline to state first.
- Since values are bounded (±10⁴), a counting array also gives O(n + range).
- Pitfall: `nums.sort()` without a comparator sorts as strings (`[10, 9, 2]` becomes `[10, 2, 9]`).
- Pitfall: quickselect with Lomuto partition degrades badly on many duplicates. Use three-way partitioning.
- Edge cases: k = 1, k = n, all values equal, negative values.
