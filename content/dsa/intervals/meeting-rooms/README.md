---
title: Meeting Rooms
type: dsa
difficulty: easy
topic: intervals
order: 4
neetcode: true
tags: [intervals, sorting]
estimatedMinutes: 10
---

You get a list of meeting times, each `[start, end]`. Return `true` if one person could attend **all** of them, meaning no two meetings overlap.

A meeting ending at time `t` and another starting at time `t` do **not** overlap.

```js
function canAttendMeetings(intervals) // → boolean
```

## Examples

```text
Input:  intervals = [[0,30],[5,10],[15,20]]
Output: false
Explanation: [0,30] overlaps both other meetings.

Input:  intervals = [[7,10],[2,4]]
Output: true
```

## Constraints

- 0 ≤ `intervals.length` ≤ 10⁴
- 0 ≤ start < end ≤ 10⁶

## Notes

- **Identify:** can one person attend every meeting → sort by start and look for any overlap
- **Brute force:** compare every pair of meetings, O(n²)
- **Insight:** after sorting by start, an overlap can only happen between neighbours
- **Steps:** sort by start; if any meeting starts before the previous one ends, return false
- **Complexity:** O(n²) → O(n log n) time, O(1) extra space
- **Pitfall:** back-to-back meetings ([0, 5] then [5, 10]) are fine: use a strict <
- **Related:** Meeting Rooms II, Merge Intervals, Non-overlapping Intervals
