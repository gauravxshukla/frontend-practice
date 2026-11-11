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

- **Identify:** use every ticket exactly once from JFK, smallest lexical order → Eulerian path (Hierholzer)
- **Brute force:** backtracking over sorted destinations, undoing dead ends, exponential worst case
- **Insight:** DFS greedily by smallest destination; append an airport only when it has no tickets left, then reverse
- **Steps:** sort each airport's destinations; visit(a): while a has tickets, visit(next smallest); then add a; reverse
- **Complexity:** exponential → O(E log E) time, O(E) space
- **Pitfall:** adding airports on the way in (pre-order) fails when a smaller branch is a dead end
- **Related:** Course Schedule II, Alien Dictionary, Word Ladder
