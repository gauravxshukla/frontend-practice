---
title: Network Delay Time
type: dsa
difficulty: medium
topic: advanced-graphs
order: 1
neetcode: true
tags: [graphs, dijkstra, shortest-path, heap]
estimatedMinutes: 25
---

A network has `n` nodes labelled `1` to `n`. Each entry `[u, v, w]` in `times` is a **directed** link: a signal sent from `u` reaches `v` after `w` time units.

A signal is sent from node `k`. Return how long it takes until **every** node has received it, or `-1` if some node can never receive it.

```js
function networkDelayTime(times, n, k) // → number
```

## Examples

```text
Input:  times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2
Output: 2
Explanation: node 2 reaches 1 and 3 at time 1, and 4 at time 2.

Input:  times = [[1,2,1]], n = 2, k = 1
Output: 1

Input:  times = [[1,2,1]], n = 2, k = 2
Output: -1
Explanation: links are one-way, so node 1 is unreachable from node 2.
```

## Constraints

- 1 ≤ `n` ≤ 100, 1 ≤ `k` ≤ `n`
- 0 ≤ `times.length` ≤ 6000
- 0 ≤ `w` ≤ 100; no two links share the same `(u, v)` pair

## Notes

- **Key insight:** the time for node `v` to hear the signal is its shortest-path distance from `k`. The answer is the **largest** of those distances, or `-1` if any is infinite.
- Weights are non-negative, so use **Dijkstra**: a min-heap of `[distance, node]`, starting with `[0, k]`. Pop the closest node; skip it if the entry is stale; otherwise relax its outgoing links and push improved distances.
- Nodes settle in non-decreasing distance order, so the distance of the last settled node is the answer if all `n` were settled.
- O(E log E) time with a binary heap, O(V + E) space.
- Bellman-Ford alternative: relax every edge `n - 1` times; O(V · E), simple, and works with negative weights.
- For tiny dense graphs, O(V²) Dijkstra without a heap (scan for the closest unsettled node) is competitive.
- Pitfall: treating the links as undirected.
- Pitfall: zero-weight links are allowed; make sure the "stale entry" check uses `>`, not `>=`.
- Pitfall: JavaScript has no built-in priority queue; write a small binary heap rather than sorting the queue on every push.
- Follow-up: return the actual path to the slowest node (track predecessors), or handle negative weights (Bellman-Ford).
