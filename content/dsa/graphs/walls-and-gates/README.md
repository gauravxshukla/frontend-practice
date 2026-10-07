---
title: Walls and Gates
type: dsa
difficulty: medium
topic: graphs
order: 4
neetcode: true
tags: [graphs, grid, bfs, multi-source-bfs]
estimatedMinutes: 20
---

You get a grid `rooms` of integers:

- `-1` is a wall,
- `0` is a gate,
- `2147483647` (2³¹ − 1, think "infinity") is an empty room.

Fill **in place** every empty room with the number of steps to its nearest gate, moving up, down, left or right and never through walls. A room that cannot reach any gate keeps `2147483647`. Return nothing.

```js
function wallsAndGates(rooms) // → void (modify rooms)
```

## Examples

```text
INF = 2147483647

Input:  rooms = [
  [INF, -1,   0, INF],
  [INF, INF, INF, -1],
  [INF, -1, INF, -1],
  [  0, -1, INF, INF]
]
Output: [
  [3, -1, 0,  1],
  [2,  2, 1, -1],
  [1, -1, 2, -1],
  [0, -1, 3,  4]
]

Input:  rooms = [[0, INF], [INF, INF]]
Output: [[0, 1], [1, 2]]
```

## Constraints

- 1 ≤ rows, cols ≤ 250
- Each cell is `-1`, `0`, or `2147483647`

## Notes

- **Key insight:** run one BFS that starts from **all gates at once** (multi-source BFS). The first time the wave reaches a room is its shortest distance to any gate.
- Push every gate into the first frontier. Expand level by level; for each neighbour still equal to `INF`, write the current level and add it to the next frontier.
- The `INF` check doubles as the visited test, so no extra set is needed.
- O(rows · cols) time, since each cell is written at most once. O(rows · cols) space for the queue in the worst case.
- Brute-force baseline: BFS from each empty room until a gate is found, or BFS from each gate separately and keep minimums. Both are O((rows · cols)²) in the worst case.
- Pitfall: DFS from each gate with "update if smaller" works but can revisit cells many times; BFS is the clean answer.
- Pitfall: `Array.shift()` on a big queue is O(n); use level arrays or a head index.
- Edge cases: no gates (nothing changes), rooms walled off from every gate (stay `INF`), a grid of only walls.
- Follow-up: return the distance to the nearest gate for a list of query cells; or allow different move costs (switch to Dijkstra).
