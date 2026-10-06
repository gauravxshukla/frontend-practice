---
title: Insertion Sort
type: dsa
difficulty: easy
tags: [sorting]
estimatedMinutes: 10
---

Implement `insertionSort(arr)`, which sorts an array of numbers in ascending order **in place** and returns it. Don't use `Array.prototype.sort`.

Grow a sorted prefix: take the next element and shift larger elements of the prefix right until you find its slot.

## Notes

- O(n²) worst case, but O(n) on nearly-sorted input, which makes it **adaptive**. That's why hybrid sorts like TimSort use it for small runs.
- Stable, O(1) space.
- Shift, don't swap: hold `current` in a variable and move elements right, then drop `current` into the gap.
