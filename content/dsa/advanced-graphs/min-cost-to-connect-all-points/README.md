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

- **Identify:** connect all points with minimum total edge cost → minimum spanning tree (Prim's)
- **Key formula:** cost between points = |x1 − x2| + |y1 − y2| (Manhattan distance)
- **Brute force:** Kruskal on all n² edges: sort them, then union-find, O(n² log n)
- **Insight:** the graph is complete, so array-based Prim (cheapest link into the tree per point) avoids sorting n² edges
- **Steps:** best[i] = cheapest edge from the tree to i; repeatedly add the cheapest outside point and update best
- **Complexity:** O(n² log n) → O(n²) time, O(n) space
- **Pitfall:** mark points as in the tree, or a point is added twice; a single point costs 0
- **Related:** Network Delay Time, Redundant Connection, Swim in Rising Water
