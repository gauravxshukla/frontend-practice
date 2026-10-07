---
title: Min Cost to Connect All Points
type: dsa
difficulty: medium
topic: advanced-graphs
order: 3
neetcode: true
tags: [graphs, minimum-spanning-tree, prim, kruskal]
estimatedMinutes: 25
---

You get an array `points` of distinct `[x, y]` coordinates. Connecting two points costs their **Manhattan distance**, `|x1 - x2| + |y1 - y2|`.

Return the minimum total cost to connect all the points, so that there is exactly one simple path between any two of them.

```js
function minCostConnectPoints(points) // → number
```

## Examples

```text
Input:  points = [[0,0],[2,2],[3,10],[5,2],[7,0]]
Output: 20

Input:  points = [[3,12],[-2,5],[-4,1]]
Output: 18
Explanation: connect [-4,1]–[-2,5] for 6 and [-2,5]–[3,12] for 12.
```

## Constraints

- 1 ≤ `points.length` ≤ 1000
- −10⁶ ≤ `x`, `y` ≤ 10⁶
- All points are distinct

## Notes

- **Key insight:** this is a **minimum spanning tree** on a complete graph where every pair of points is an edge.
- Prim's algorithm, dense version: keep `best[i]` = cheapest edge from the growing tree to point `i`. Repeatedly add the cheapest point not yet in the tree, add its cost, and update `best` for every other point. No heap and no edge list needed.
- That is O(n²) time and O(n) space, which is optimal for a complete graph with n² edges.
- Kruskal alternative: list all n(n−1)/2 edges, sort, and union-find them in order. O(n² log n) time and O(n²) memory, so it is heavier here.
- Prim with a heap is O(n² log n) on a dense graph; the array version is simpler and faster.
- Pitfall: a single point costs `0`.
- Pitfall: Euclidean distance is wrong; use Manhattan.
- Follow-up: for very large n, only the nearest neighbour in each of 8 octants matters, which shrinks the edge list to O(n) and gives O(n log n).
