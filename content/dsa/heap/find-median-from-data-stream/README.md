---
title: Find Median from Data Stream
type: dsa
difficulty: hard
topic: heap
order: 7
neetcode: true
tags: [design, heap, two-heaps, data-stream]
estimatedMinutes: 30
---

Build a `MedianFinder` class that receives numbers one at a time and can report the **median** of everything seen so far at any point. With an odd count the median is the middle value. With an even count it's the average of the two middle values.

- `new MedianFinder()` starts empty.
- `addNum(num)` adds a number.
- `findMedian()` returns the current median. It's only called after at least one `addNum`.

```js
class MedianFinder {
  addNum(num)   // → void
  findMedian()  // → number
}
```

Medians are compared with a small floating-point tolerance.

## Examples

The judge calls the methods in order. `operations[i]` is called with `arguments[i]`, and the output lists each call's return value (`null` for the constructor and for `addNum`).

```text
Input:
  operations = ["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]
  arguments  = [[],[1],[2],[],[3],[]]
Output: [null,null,null,1.5,null,2]

Input:
  operations = ["MedianFinder","addNum","findMedian","addNum","findMedian"]
  arguments  = [[],[-1],[],[-2],[]]
Output: [null,null,-1,null,-1.5]
```

## Constraints

- −10⁵ ≤ `num` ≤ 10⁵
- At most 5 · 10⁴ calls in total.
- `findMedian` is called only when at least one number has been added.

## Notes

- **Key insight:** the median only depends on the boundary between the smaller half and the larger half. Keep the smaller half in a **max-heap** (`low`) and the larger half in a **min-heap** (`high`), and the median is at their tops.
- Invariants: every value in `low` ≤ every value in `high`, and `low.size` is equal to `high.size` or one more.
- `addNum`: push into `low`, move `low`'s max into `high` (this restores ordering), and if `high` became larger, move its min back to `low`.
- `findMedian`: odd count → `low.peek()`. Even count → the average of both tops.
- `addNum` is O(log n), `findMedian` is O(1), and space is O(n).
- Brute force: keep a sorted array and insert with binary search. Lookup is O(1) but the insert shifts elements, O(n). Sorting on every query is O(n log n).
- Pitfall: checking only the sizes and forgetting the ordering step lets a large number sit in `low`.
- Follow-ups: if all numbers are in `[0, 100]`, use 101 counters and walk them. If 99% are in that range, add overflow counters for the outliers. For a sliding-window median, use two heaps with lazy deletion.
