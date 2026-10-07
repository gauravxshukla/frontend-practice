---
title: Bubble Sort
type: dsa
difficulty: easy
topic: sorting-basics
order: 1
neetcode: false
tags: [sorting]
estimatedMinutes: 10
---

Implement `bubbleSort(arr)`, which sorts an array of numbers in ascending order **in place** and returns it. Don't use `Array.prototype.sort`.

Repeatedly walk the array and swap adjacent elements that are out of order, until a pass makes no swaps.

## Notes

- After pass `i`, the largest `i + 1` elements are in their final place, so the inner loop can stop at `n - 1 - i`.
- Early exit: if a pass makes no swaps, the array is sorted, which gives O(n) on sorted input.
- O(n²) time, O(1) space, **stable**.
