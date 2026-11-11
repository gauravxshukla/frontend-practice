---
title: Clone Graph
type: dsa
difficulty: medium
topic: graphs
order: 3
neetcode: true
tags: [graphs, hash-map, bfs, dfs]
estimatedMinutes: 20
---

You get a reference to one node of a connected, undirected graph. Graph nodes are `{ val, neighbors }`, where `neighbors` is an array of nodes. Every `val` is unique and the values are `1..n`.

Return a **deep copy** of the whole graph: brand-new node objects with the same values and the same connections. No node in your result may be one of the original objects. If the input is `null` (an empty graph), return `null`.

```js
function cloneGraph(node) // → node (the copy of the input node)
```

In the examples, a graph is shown as an adjacency list: entry `i` lists the neighbour values of the node with value `i + 1`. You receive the node with value `1`.

## Examples

```text
Input:  adjList = [[2,4],[1,3],[2,4],[1,3]]
Output: [[2,4],[1,3],[2,4],[1,3]]
Explanation: a 4-cycle 1-2-3-4-1. The copy has the same shape but new objects.

Input:  adjList = [[2],[1]]
Output: [[2],[1]]

Input:  adjList = []
Output: []
Explanation: the graph is empty, so the input node is null.
```

## Constraints

- 0 ≤ number of nodes ≤ 100
- `1 ≤ node.val ≤ 100`, all values unique
- No self-loops or repeated edges; the graph is connected

## Notes

- **Identify:** deep copy of a connected graph with cycles → DFS + map from original to clone
- **Brute force:** copy nodes without remembering clones; cycles recurse forever or duplicate nodes
- **Insight:** register each clone in the map before visiting neighbours, so cycles reuse it
- **Steps:** clone(node): if mapped, return the clone; else create it, map it, clone each neighbour into its list
- **Complexity:** O(V + E) time, O(V) space for the map and recursion
- **Pitfall:** put the clone in the map before recursing, or a cycle loops forever; null input returns null
- **Related:** Copy List with Random Pointer, Course Schedule, Number of Islands
