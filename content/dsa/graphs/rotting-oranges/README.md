---
title: Rotting Oranges
type: dsa
difficulty: medium
topic: graphs
order: 5
neetcode: true
tags: [graphs, grid, bfs, multi-source-bfs]
estimatedMinutes: 20
---

You get a grid where each cell is `0` (empty), `1` (a fresh orange) or `2` (a rotten orange). Every minute, each fresh orange that is directly up, down, left or right of a rotten orange turns rotten.

Return the number of minutes until no fresh orange remains. If some fresh orange can never rot, return `-1`. If there are no fresh oranges to begin with, the answer is `0`.

```js
function orangesRotting(grid) // → number
```

## Examples

```text
Input:  grid = [[2,1,1],[1,1,0],[0,1,1]]
Output: 4

Input:  grid = [[2,1,1],[0,1,1],[1,0,1]]
Output: -1
Explanation: the orange in the bottom-left corner has no rotten neighbour, ever.

Input:  grid = [[0,2]]
Output: 0
```

## Constraints

- 1 ≤ rows, cols ≤ 10
- Each cell is `0`, `1`, or `2`

## Notes

- **Key insight:** the rot spreads like a BFS wave from **every** rotten orange simultaneously, and each BFS level is one minute.
- Count the fresh oranges and collect all rotten ones as the starting frontier.
- While the frontier is non-empty **and** fresh oranges remain: minute++, rot every fresh neighbour, decrement the fresh count, collect them as the next frontier.
- At the end, return the minutes if `fresh === 0`, otherwise `-1`.
- O(rows · cols) time and space.
- Brute-force baseline: simulate minute by minute, scanning the whole grid each time to find oranges next to rot. O((rows · cols)²) in the worst case.
- Pitfall: counting one extra minute after the last orange rots (stop when `fresh` hits 0, or subtract one at the end).
- Pitfall: rotting oranges during the same scan you are reading from, which lets rot travel several cells in one minute. Use a separate next frontier.
- Edge cases: no oranges at all (`0`), no rotten orange but some fresh ones (`-1`), all already rotten (`0`).
- Follow-up: return the time each individual orange rots, or let some cells be "immune" for k minutes.
