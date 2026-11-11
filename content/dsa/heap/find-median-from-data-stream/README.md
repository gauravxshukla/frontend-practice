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

- **Identify:** running median of a stream → two heaps: max-heap for the low half, min-heap for the high half
- **Brute force:** keep a sorted list and insert in place, O(n) per add
- **Insight:** the median lives at the tops of the two halves, so keep them balanced in size
- **Steps:** push to low; move low's max to high; if high is bigger, move high's min back to low
- **Complexity:** add O(n) → O(log n), findMedian O(1), O(n) space
- **Pitfall:** low may hold one extra item; for an even count average the two tops as a float
- **Related:** Kth Largest Element in a Stream, Merge k Sorted Lists, Median of Two Sorted Arrays
