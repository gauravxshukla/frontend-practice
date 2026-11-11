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

- **Identify:** distance from every room to its nearest gate → multi-source BFS from all gates at once
- **Brute force:** BFS from every empty room to find its nearest gate, O((m·n)²)
- **Insight:** start BFS from every gate together; the first time a room is reached is its shortest distance
- **Steps:** queue all gates; pop a cell; for each empty neighbour (INF), set distance + 1 and enqueue it
- **Complexity:** O((m·n)²) → O(m·n) time, O(m·n) space
- **Pitfall:** only fill rooms still at INF; walls (−1) and rooms already set are skipped
- **Related:** Rotting Oranges, Pacific Atlantic Water Flow, Number of Islands
