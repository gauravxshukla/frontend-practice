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

- **Key insight:** start with `n` separate components. Every edge that joins two *different* components reduces the count by one.
- Union-find: `parent[i] = i` initially; for each edge, find both roots; if they differ, union them (by rank or size) and decrement the count.
- DFS/BFS alternative: build adjacency lists and count how many times you launch a traversal from an unvisited node.
- Union-find: O(E · α(n)) time, O(n) space. DFS: O(n + E) time and space.
- Pitfall: forgetting isolated nodes (they never appear in `edges` but still count).
- Pitfall: decrementing on edges inside the same component (duplicates or cycles) over-counts merges.
- Pitfall: union-find without path compression or rank can degrade to O(n) per find on long chains.
- Follow-up: edges arrive as a stream and you report the count after each one (union-find handles this online).
- Follow-up: return the size of the largest component (track sizes on union).
