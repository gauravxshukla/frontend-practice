---
title: Meeting Rooms II
type: dsa
difficulty: medium
topic: intervals
order: 5
neetcode: true
tags: [intervals, sorting, heap, two-pointers]
estimatedMinutes: 20
---

You get a list of meeting times, each `[start, end]`. Return the **minimum number of rooms** needed so that every meeting can happen, with no two meetings sharing a room at the same time.

A meeting ending at time `t` frees its room for a meeting starting at time `t`.

```js
function minMeetingRooms(intervals) // → number
```

## Examples

```text
Input:  intervals = [[0,30],[5,10],[15,20]]
Output: 2
Explanation: [0,30] needs its own room. [5,10] and [15,20] can share a second one.

Input:  intervals = [[7,10],[2,4]]
Output: 1
```

## Constraints

- 0 ≤ `intervals.length` ≤ 10⁴
- 0 ≤ start < end ≤ 10⁶

## Notes

- **Key insight:** the answer is the largest number of meetings running at the same moment. That peak always happens at some meeting's start.
- **Two sorted arrays (chronological sweep):** sort `starts` and `ends` separately. Walk the starts; if the earliest unprocessed end is `≤` the current start, a room was freed (advance the end pointer), otherwise you need a new room.
- **Min-heap alternative:** sort by start, keep a min-heap of end times of rooms in use. Pop the top if it ends `≤` the current start, then push the current end. The heap size at the end is the answer.
- Both are O(n log n) time and O(n) space.
- Brute force: for each start time count the meetings active at that instant, O(n²).
- Pitfall: freeing a room only when `end < start` counts back-to-back meetings as needing two rooms.
- Edge cases: empty input needs 0 rooms. Identical meetings need one room each.
- Follow-up: return which room each meeting goes to (the heap version extends naturally by storing room ids).
