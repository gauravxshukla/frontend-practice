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

- **Identify:** are n nodes and these edges one tree → exactly n − 1 edges and no cycle (union-find)
- **Key formula:** a tree on n nodes has exactly n − 1 edges
- **Brute force:** DFS from node 0 tracking parents to find cycles, then check all nodes were reached
- **Insight:** with n − 1 edges, "no cycle" alone proves connected; union-find spots a cycle when both ends share a root
- **Steps:** if edges ≠ n − 1 return false; for each edge, find both roots; same root → cycle → false; else union
- **Complexity:** O(V + E) either way; union-find is O(E·α(n)) with O(n) space
- **Pitfall:** n = 1 with no edges is a valid tree; a duplicate edge is a cycle
- **Related:** Number of Connected Components in an Undirected Graph, Redundant Connection, Course Schedule
