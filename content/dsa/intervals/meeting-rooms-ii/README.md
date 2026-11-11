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

- **Identify:** fewest rooms for overlapping meetings → maximum number of meetings running at once
- **Brute force:** for every time point, count the meetings covering it, O(n · range)
- **Better:** sort by start and keep a min-heap of end times, O(n log n)
- **Insight:** only the order of starts and ends matters: sweep both sorted lists with two pointers
- **Steps:** sort starts and ends; for each start, if it's ≥ the earliest unfinished end, reuse that room (move end pointer), else add a room
- **Complexity:** O(n · range) → O(n log n) time, O(n) space
- **Pitfall:** a meeting starting exactly when another ends can reuse its room (≥)
- **Related:** Meeting Rooms, Merge Intervals, Minimum Interval to Include Each Query
