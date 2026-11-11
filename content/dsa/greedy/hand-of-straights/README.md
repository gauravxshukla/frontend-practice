---
title: Hand of Straights
type: dsa
difficulty: medium
topic: greedy
order: 5
neetcode: true
tags: [arrays, greedy, hash-map, sorting]
estimatedMinutes: 20
---

You hold a hand of cards, given as an array of integers `hand`, and a number `groupSize`. Decide whether you can split **all** the cards into groups where each group has exactly `groupSize` cards with consecutive values (like `[4, 5, 6]`).

Return `true` if such a split exists, otherwise `false`. Every card must be used exactly once.

```js
function isNStraightHand(hand, groupSize) // → boolean
```

## Examples

```text
Input:  hand = [1,2,3,6,2,3,4,7,8], groupSize = 3
Output: true
Explanation: Groups [1,2,3], [2,3,4], [6,7,8].

Input:  hand = [1,2,3,4,5], groupSize = 4
Output: false
Explanation: 5 cards cannot be split into groups of 4.
```

## Constraints

- 1 ≤ `hand.length` ≤ 10⁴
- 0 ≤ `hand[i]` ≤ 10⁹
- 1 ≤ `groupSize` ≤ `hand.length`

## Notes

- **Identify:** split cards into runs of groupSize consecutive values → greedy from the smallest card
- **Brute force:** try every way of forming groups with backtracking, exponential
- **Insight:** the smallest remaining card must start a run, so build that run immediately
- **Steps:** if n % groupSize ≠ 0 return false; count cards; for each value in sorted order with count > 0, use one of each of the next groupSize values
- **Complexity:** exponential → O(n log n + n·k) time, O(n) space
- **Pitfall:** process values in sorted order and skip ones already used up by earlier runs
- **Related:** Task Scheduler, Partition Labels, Longest Consecutive Sequence
