---
title: Reconstruct Itinerary
type: dsa
difficulty: hard
topic: advanced-graphs
order: 2
neetcode: true
tags: [graphs, eulerian-path, dfs, hierholzer]
estimatedMinutes: 30
---

You get a list of flight `tickets`, where each `[from, to]` is a one-way flight between airports named by three capital letters. All the tickets belong to one traveller who started at `"JFK"`.

Rebuild the trip: return the list of airports visited, starting with `"JFK"`, that uses **every ticket exactly once**. At least one such itinerary is guaranteed to exist. If there are several, return the one that is smallest in **lexical order** when the airport names are compared one by one (so `["JFK","LGA"]` beats `["JFK","LGB"]`).

```js
function findItinerary(tickets) // → string[]
```

## Examples

```text
Input:  tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]
Output: ["JFK","MUC","LHR","SFO","SJC"]

Input:  tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]
Output: ["JFK","ATL","JFK","SFO","ATL","SFO"]
Explanation: ["JFK","SFO","ATL","JFK","ATL","SFO"] also uses every ticket, but it is lexically larger.
```

## Constraints

- 1 ≤ `tickets.length` ≤ 300
- Airport codes are three uppercase letters; the same ticket may appear more than once
- A valid itinerary using all tickets always exists

## Notes

- **Key insight:** using every edge exactly once is an **Eulerian path**. Hierholzer's algorithm finds one in linear time, and visiting destinations in sorted order makes it the lexically smallest.
- Build `from → [destinations]`, sorted. Keep a stack starting with `"JFK"`. While the stack is non-empty: if the top airport still has unused tickets, push its smallest destination (removing that ticket); otherwise pop it onto the route. Reverse the route at the end.
- Why it works: an airport is appended only once it is a dead end, so any detour that greedy choice got stuck in is spliced in at the right place.
- O(E log E) time (sorting dominates), O(E) space.
- Brute-force baseline: backtracking DFS that tries destinations in sorted order, undoes on a dead end, and stops at the first route that uses all tickets. Correct, but exponential in the worst case.
- Pitfall: plain greedy (always take the smallest destination, append as you go) fails on `[["JFK","KUL"],["JFK","NRT"],["NRT","JFK"]]`; it gets stuck at `KUL` early.
- Pitfall: duplicate tickets are separate edges; don't store destinations in a `Set`.
- Tip: sort each list in **reverse** so `pop()` removes the smallest in O(1).
- Follow-up: detect whether any Eulerian path exists (in/out-degree conditions plus connectivity).
