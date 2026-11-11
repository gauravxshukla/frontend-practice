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

- **Identify:** can all courses be taken given prerequisites → cycle detection in a directed graph (topological sort)
- **Brute force:** for each course, DFS its prerequisites and look for a path back to itself, O(V·(V + E))
- **Insight:** repeatedly take courses with no remaining prerequisites (Kahn's BFS); a cycle leaves some never ready
- **Steps:** build edges pre → course and in-degrees; queue in-degree 0; pop, count, decrement neighbours; done if count == n
- **Complexity:** O(V·(V + E)) → O(V + E) time, O(V + E) space
- **Pitfall:** a self-loop [0, 0] is a cycle; edges go prerequisite → course, not the reverse
- **Related:** Course Schedule II, Graph Valid Tree, Alien Dictionary
