---
title: Redundant Connection
type: dsa
difficulty: medium
topic: graphs
order: 12
neetcode: true
tags: [graphs, union-find, cycle-detection]
estimatedMinutes: 20
---

A tree with `n` nodes labelled `1` to `n` had **one extra edge** added, between two distinct nodes that were not already directly connected. The resulting undirected graph is given as `edges`, a list of `n` pairs `[a, b]`.

Return an edge whose removal turns the graph back into a tree. If several edges would work, return the one that appears **last** in `edges`.

```js
function findRedundantConnection(edges) // → number[]
```

## Examples

```text
Input:  edges = [[1,2],[1,3],[2,3]]
Output: [2,3]

Input:  edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]
Output: [1,4]
Explanation: the cycle is 1-2-3-4-1. Any of its four edges could go, and [1,4] is the last one listed.
```

## Constraints

- 3 ≤ `n` ≤ 1000, and `edges.length === n`
- `1 ≤ a < b ≤ n`; no repeated edges
- The graph is connected

## Notes

- **Identify:** a tree plus one extra edge, find the edge to remove → union-find, first edge joining an existing group
- **Brute force:** remove each edge in turn and check the rest is a tree, O(E·(V + E))
- **Insight:** process edges in order; the first one whose endpoints already share a root closes the cycle
- **Steps:** parent[i] = i (1-indexed nodes); for each edge, if find(a) == find(b) return it; else union
- **Complexity:** O(E·(V + E)) → O(E·α(n)) time, O(n) space
- **Pitfall:** nodes are labelled 1..n, so size the parent array n + 1
- **Related:** Graph Valid Tree, Number of Connected Components in an Undirected Graph, Course Schedule
