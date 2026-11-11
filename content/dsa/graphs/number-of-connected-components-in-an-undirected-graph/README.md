---
title: Number of Connected Components in an Undirected Graph
type: dsa
difficulty: medium
topic: graphs
order: 11
neetcode: true
tags: [graphs, union-find, dfs, bfs]
estimatedMinutes: 15
---

You get `n` nodes labelled `0` to `n - 1` and a list of undirected `edges`, where `[a, b]` connects `a` and `b`. A connected component is a maximal group of nodes that can all reach one another.

Return how many connected components the graph has. A node with no edges is a component by itself.

```js
function countComponents(n, edges) // → number
```

## Examples

```text
Input:  n = 5, edges = [[0,1],[1,2],[3,4]]
Output: 2
Explanation: {0,1,2} and {3,4}.

Input:  n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]
Output: 1
```

## Constraints

- 1 ≤ `n` ≤ 2000
- 0 ≤ `edges.length` ≤ 5000
- `0 ≤ a, b < n`, `a ≠ b`; edges may repeat

## Notes

- **Identify:** count separate groups of connected nodes → union-find (or DFS from each unvisited node)
- **Brute force:** BFS from every node with a fresh visited set and dedupe the groups, O(V·(V + E))
- **Insight:** start with n components; every edge joining two different roots merges two into one
- **Steps:** count = n; for each edge, find both roots; if different, union them and count−−
- **Complexity:** O(V·(V + E)) → O(V + E·α(n)) time, O(n) space
- **Pitfall:** duplicate edges and edges inside a component must not decrement the count
- **Related:** Graph Valid Tree, Redundant Connection, Number of Islands
