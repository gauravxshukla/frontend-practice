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

- **Key insight:** after sorting by start time, only *neighbouring* meetings can clash. If meeting `i` ends after meeting `i + 1` starts, you have a conflict.
- Sort a copy by start, then check `sorted[i][0] < sorted[i - 1][1]` for each `i`.
- O(n log n) time for the sort, O(n) for the copy (O(1) if you sort in place).
- Brute force: compare every pair, overlapping iff `a.start < b.end && b.start < a.end`. O(n²).
- Pitfall: `≤` vs `<`. Back-to-back meetings `[0,5]` and `[5,10]` are fine.
- Edge cases: no meetings or a single meeting is always `true`. Identical meetings always clash.
- Follow-up: Meeting Rooms II asks how many rooms you need if they can't all be attended.
