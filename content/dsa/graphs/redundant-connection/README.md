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

- **Key insight:** process edges in order with union-find. The first edge whose two endpoints are **already connected** closes the only cycle, so it is the answer.
- Why it is also the *last* valid edge: all other edges on the cycle were added before it (otherwise its endpoints would not yet be connected), so it is the latest cycle edge in the input.
- O(n · α(n)) time and O(n) space.
- Brute-force baseline: try removing edges from last to first; after each removal, check with DFS whether the rest is connected. The first success is the answer. O(n²).
- DFS alternative: before adding each edge, DFS to see if `a` can already reach `b`; that is also O(n²).
- Pitfall: returning the first cycle edge found by a DFS of the full graph, which is not necessarily the last one in the input.
- Pitfall: nodes are 1-indexed, so size the parent array `n + 1`.
- Follow-up: "Redundant Connection II", the directed version, where one node may end up with two parents.
