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

- **Identify:** time for a signal to reach every node, non-negative weights → Dijkstra's shortest paths
- **Brute force:** Bellman-Ford relaxing every edge n − 1 times, O(V·E)
- **Insight:** always settle the closest unsettled node next; with non-negative weights its distance is final
- **Steps:** min-heap of (time, node) from k; pop; skip if settled; settle and push neighbours with time + w
- **Complexity:** O(V·E) → O(E log E) time, O(V + E) space
- **Pitfall:** the answer is the largest settled time, or −1 if any node was never reached
- **Related:** Cheapest Flights Within K Stops, Swim in Rising Water, Min Cost to Connect All Points
