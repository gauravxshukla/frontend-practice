---
title: Selection Sort
type: dsa
difficulty: easy
tags: [sorting]
estimatedMinutes: 10
---

Implement `selectionSort(arr)`, which sorts an array of numbers in ascending order **in place** and returns it. Don't use `Array.prototype.sort`.

For each position `i`, find the smallest element in `arr[i..]` and swap it into position `i`.

## Notes

- Always O(n²) comparisons, even on sorted input, but at most n − 1 swaps. That's useful when writes are expensive.
- **Not stable** (a long-distance swap can reorder equal elements).
