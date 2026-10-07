---
title: Course Schedule
type: dsa
difficulty: medium
topic: graphs
order: 8
neetcode: true
tags: [graphs, topological-sort, cycle-detection, bfs]
estimatedMinutes: 20
---

There are `numCourses` courses labelled `0` to `numCourses - 1`. Each entry `[a, b]` in `prerequisites` means you must finish course `b` before you can start course `a`.

Return `true` if it is possible to finish every course, and `false` otherwise.

```js
function canFinish(numCourses, prerequisites) // → boolean
```

## Examples

```text
Input:  numCourses = 2, prerequisites = [[1,0]]
Output: true
Explanation: take course 0, then course 1.

Input:  numCourses = 2, prerequisites = [[1,0],[0,1]]
Output: false
Explanation: each course requires the other, so neither can be started.
```

## Constraints

- 1 ≤ `numCourses` ≤ 2000
- 0 ≤ `prerequisites.length` ≤ 5000
- `0 ≤ a, b < numCourses`; a pair may point a course at itself, and pairs may repeat

## Notes

- **Key insight:** courses are nodes and prerequisites are directed edges `b → a`. All courses can be finished exactly when the graph has **no cycle**.
- Kahn's algorithm (BFS): count each course's incoming edges. Queue every course with in-degree 0, pop one, "take" it, and decrement the in-degree of everything it unlocks, queueing those that hit 0. If you took all `numCourses`, there was no cycle.
- DFS alternative: three colours (unvisited, on the current path, finished). Reaching a node that is on the current path means a cycle.
- O(V + E) time and space either way.
- Brute-force baseline: repeatedly scan for any course whose prerequisites are all done until nothing changes; O(V · E).
- Pitfall: a self-loop like `[0,0]` is a cycle by itself.
- Pitfall: duplicate pairs must be counted consistently (Kahn's handles them if every copy adds to the in-degree and every copy is decremented).
- Pitfall: recursive DFS on a 2000-node chain can be deep; Kahn's is iterative.
- Follow-up: return an actual order (Course Schedule II), or the minimum number of semesters when you can take any number of available courses per semester (BFS levels).
