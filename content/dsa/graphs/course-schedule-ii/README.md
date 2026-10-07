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

- **Key insight:** a valid order is a **topological sort** of the graph with edges `b → a`; one exists exactly when the graph has no cycle.
- Kahn's algorithm: build adjacency lists and in-degrees, seed a queue with every in-degree-0 course, and repeatedly pop a course, append it to the order, and decrement its dependents. The queue itself is the answer.
- If the order ends up shorter than `numCourses`, some courses sit on or behind a cycle, so return `[]`.
- DFS alternative: post-order DFS with three colours, then reverse the post-order. A back edge (a node still on the stack) means a cycle.
- O(V + E) time and space.
- Pitfall: returning a partial order instead of `[]` when there is a cycle.
- Pitfall: courses with no prerequisites and no dependents must still appear in the result.
- Pitfall: in the DFS version, forgetting to reverse gives dependents before prerequisites.
- Follow-up: return the lexicographically smallest valid order (swap the queue for a min-heap).
- Grading: any valid order is accepted. The checker confirms your array is a permutation of all courses that respects every prerequisite, or that it is `[]` when no order exists.
