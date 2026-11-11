---
title: Course Schedule II
type: dsa
difficulty: medium
topic: graphs
order: 9
neetcode: true
tags: [graphs, topological-sort, bfs, dfs]
estimatedMinutes: 20
---

There are `numCourses` courses labelled `0` to `numCourses - 1`. Each entry `[a, b]` in `prerequisites` means course `b` must be taken before course `a`.

Return an order in which you can take **all** the courses, as an array containing each course exactly once. If several orders work, any of them is accepted. If no order exists, return an empty array `[]`.

```js
function findOrder(numCourses, prerequisites) // → number[]
```

## Examples

```text
Input:  numCourses = 2, prerequisites = [[1,0]]
Output: [0,1]

Input:  numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]
Output: [0,2,1,3]
Explanation: [0,1,2,3] is equally valid. Course 0 comes first, and 3 comes after both 1 and 2.

Input:  numCourses = 2, prerequisites = [[0,1],[1,0]]
Output: []
Explanation: the two courses depend on each other.
```

## Constraints

- 1 ≤ `numCourses` ≤ 2000
- 0 ≤ `prerequisites.length` ≤ `numCourses · (numCourses − 1)`
- `0 ≤ a, b < numCourses`; pairs may repeat, and a pair may point a course at itself

## Notes

- **Identify:** an order to take all courses, or [] if impossible → topological sort (Kahn's BFS)
- **Brute force:** try orderings and check each against the prerequisites, O(n!·E)
- **Insight:** the order in which Kahn's algorithm frees courses is itself a valid order
- **Steps:** build edges and in-degrees; queue in-degree 0; pop into the order, decrement neighbours; [] if order is short
- **Complexity:** O(n!·E) → O(V + E) time, O(V + E) space
- **Pitfall:** a cycle leaves the order shorter than numCourses; return [] then, not a partial order
- **Related:** Course Schedule, Alien Dictionary, Graph Valid Tree
