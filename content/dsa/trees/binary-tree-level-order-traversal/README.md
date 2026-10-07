---
title: Binary Tree Level Order Traversal
type: dsa
difficulty: medium
topic: trees
order: 8
neetcode: true
tags: [trees, bfs, queue]
estimatedMinutes: 15
---

You get the `root` of a binary tree. Return its values **level by level**: an array of arrays, where the first array is the root level, the next one holds the root's children, and so on. Within each level, list values from left to right. An empty tree gives `[]`.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function levelOrder(root) // → number[][]
```

## Examples

```text
Input:  root = [3,9,20,null,null,15,7]
Output: [[3],[9,20],[15,7]]

Input:  root = [1]
Output: [[1]]

Input:  root = []
Output: []
```

## Constraints

- 0 ≤ number of nodes ≤ 2000
- −1000 ≤ `node.val` ≤ 1000

## Notes

- **Key insight:** BFS visits nodes in exactly this order. You only need to know where one level ends and the next begins.
- **Optimal:** keep the current level in an array (or note the queue length before processing a level). Record its values, then collect all their non-null children as the next level. O(n) time, O(w) extra space, where w is the widest level.
- **DFS alternative:** recurse with a `depth` argument and push each value into `result[depth]`. Pre-order (left before right) keeps each level ordered left to right.
- Pitfall: `queue.shift()` is O(n) in JS arrays. For large trees, use a head index or swap level arrays as shown in the reference.
- Pitfall: pushing `null` children into the queue and then reading `.val` on them.
- Return `[]` for an empty tree, not `[[]]`.
- Follow-ups: zigzag order (reverse every other level), bottom-up order, per-level averages or maximums, and right side view.
