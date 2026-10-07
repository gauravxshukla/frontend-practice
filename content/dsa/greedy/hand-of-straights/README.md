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

- **Key insight:** the smallest remaining card has no smaller neighbour, so it *must* start a group. That forced choice makes the greedy correct.
- Quick reject: if `hand.length % groupSize !== 0`, return `false`.
- Count cards in a `Map`, sort the distinct values, and walk them in order. For each value `v` with `count[v] > 0`, take `c = count[v]` groups starting at `v`: every `v + j` (for `j` from 0 to `groupSize − 1`) must have count ≥ `c`. Subtract `c` from each.
- O(n log n) time for the sort, O(n) space for the map.
- Brute force: sort, then repeatedly remove the smallest card and search/splice its successors, O(n²).
- Pitfall: iterating the `Map` in insertion order instead of sorted order. The greedy only works from the smallest value up.
- Pitfall: duplicates. `[1,1,2,2,3,3]` with size 3 is two groups, so subtract counts rather than removing values.
- Same problem on LeetCode as "Divide Array in Sets of K Consecutive Numbers".
