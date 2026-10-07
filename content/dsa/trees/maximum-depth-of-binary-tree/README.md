---
title: Maximum Depth of Binary Tree
type: dsa
difficulty: easy
topic: trees
order: 2
neetcode: true
tags: [trees, recursion, dfs, bfs]
estimatedMinutes: 10
---

You get the `root` of a binary tree. Return its **depth**: the number of nodes on the longest path from the root down to any leaf. An empty tree has depth 0, and a single node has depth 1.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function maxDepth(root) // → number
```

## Examples

```text
Input:  root = [3,9,20,null,null,15,7]
Output: 3
Explanation: the longest root-to-leaf paths are 3 → 20 → 15 and 3 → 20 → 7.

Input:  root = [1,null,2]
Output: 2
```

## Constraints

- 0 ≤ number of nodes ≤ 10⁴
- −100 ≤ `node.val` ≤ 100

## Notes

- **Key insight:** the depth of a tree is 1 plus the larger depth of its two subtrees. An empty subtree contributes 0.
- **Recursive DFS:** `return root ? 1 + Math.max(maxDepth(root.left), maxDepth(root.right)) : 0`. O(n) time, O(h) call stack, where h is the height.
- **Iterative BFS:** process the tree one level at a time and count the levels. O(n) time, O(w) space for the widest level, and no recursion limit to worry about.
- **Iterative DFS:** push `[node, depth]` pairs onto a stack and track the maximum depth seen.
- There's no real brute force here: every node has to be visited once, so O(n) is optimal.
- Pitfalls: returning 1 for an empty tree; counting edges instead of nodes (that's the "height" convention some textbooks use).
- A skewed tree (a linked list in disguise) makes h = n, which can overflow the stack in recursive versions for very deep inputs.
- Follow-up: minimum depth, where you must stop at the first **leaf** (a node with no children). A node with only one child is not a leaf.
