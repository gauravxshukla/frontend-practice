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

- **Key insight:** keep a map from original node to its clone. It does double duty: it is the visited set, and it lets you wire edges to clones that already exist (which is what makes cycles work).
- BFS: clone the start node, enqueue it. For each dequeued node, for each neighbour, create its clone on first sight and enqueue it, then push the neighbour's clone onto the current clone's `neighbors`.
- DFS version: `clone(n)` returns the map entry if present; otherwise creates the copy, stores it **before** recursing, then fills its neighbours.
- O(V + E) time and O(V) space for the map and queue.
- Pitfall: storing the clone in the map only after visiting neighbours causes infinite recursion on any cycle.
- Pitfall: returning the original node, or copying `neighbors` by reference (`copy.neighbors = node.neighbors`), shares nodes with the input; the judge rejects that.
- Pitfall: keying the map by `val` works here because values are unique, but keying by node identity is the general solution.
- Edge cases: `null` input, a single node with no neighbours.
- Follow-up: copy a list with random pointers (same map-of-clones idea), or clone a graph that may be disconnected given a list of all nodes.
