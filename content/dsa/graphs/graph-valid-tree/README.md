---
title: Graph Valid Tree
type: dsa
difficulty: medium
topic: graphs
order: 10
neetcode: true
tags: [graphs, union-find, dfs, cycle-detection]
estimatedMinutes: 20
---

You get `n` nodes labelled `0` to `n - 1` and a list of undirected `edges`, where `[a, b]` connects `a` and `b`.

Return `true` if these edges form a single valid **tree**: every node is connected to every other and there are no cycles. Otherwise return `false`.

```js
function validTree(n, edges) // → boolean
```

## Examples

```text
Input:  n = 5, edges = [[0,1],[0,2],[0,3],[1,4]]
Output: true

Input:  n = 5, edges = [[0,1],[1,2],[2,3],[1,3],[1,4]]
Output: false
Explanation: 1-2-3-1 is a cycle.
```

## Constraints

- 1 ≤ `n` ≤ 2000
- 0 ≤ `edges.length` ≤ 5000
- `0 ≤ a, b < n`; edges are not guaranteed to be unique, and an edge may be a self-loop

## Notes

- **Key insight:** a graph on `n` nodes is a tree exactly when it has `n - 1` edges **and** is acyclic (equivalently, `n - 1` edges and connected). Checking the edge count first rules out most bad inputs in O(1).
- Union-find: for each edge, find both roots. If they are already equal, the edge closes a cycle, so return `false`. Otherwise union them. With exactly `n - 1` edges and no cycle, the graph must be connected.
- DFS/BFS alternative: build adjacency lists, traverse from node 0 while skipping the edge you came in on, fail if you reach a visited node, and finally check that all `n` nodes were visited.
- Union-find with path compression is O(E · α(n)); DFS is O(V + E). Both use O(V + E) space at most.
- Pitfall: a single node with no edges is a valid tree (`n = 1`), but two nodes with no edges is not (disconnected).
- Pitfall: a duplicate edge `[0,1],[0,1]` is a 2-cycle in an undirected graph; in DFS you must skip the *edge* you came from, not the parent *node*, to catch it.
- Pitfall: a self-loop `[3,3]` is a cycle.
- Follow-up: find the edge to remove to make it a tree (Redundant Connection), or count components (the next problem).
