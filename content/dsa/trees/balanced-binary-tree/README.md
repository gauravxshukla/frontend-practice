---
title: Balanced Binary Tree
type: dsa
difficulty: easy
topic: trees
order: 4
neetcode: true
tags: [trees, recursion, dfs]
estimatedMinutes: 15
---

You get the `root` of a binary tree. Return `true` if it's **height-balanced**: at **every** node, the heights of the left and right subtrees differ by at most 1. An empty tree is balanced.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function isBalanced(root) // → boolean
```

## Examples

```text
Input:  root = [3,9,20,null,null,15,7]
Output: true

Input:  root = [1,2,2,3,3,null,null,4,4]
Output: false
Explanation: at the root, the left subtree has height 3 and the right subtree has height 1.

Input:  root = []
Output: true
```

## Constraints

- 0 ≤ number of nodes ≤ 5000
- −10⁴ ≤ `node.val` ≤ 10⁴

## Notes

- **Key insight:** a single bottom-up pass can return each subtree's height and also report "unbalanced" with a sentinel like `-1`.
- **Optimal:** post-order DFS. If either child returns `-1`, or the two heights differ by more than 1, return `-1`. Otherwise return `1 + max(left, right)`. O(n) time, O(h) stack.
- **Brute force:** at each node, call a separate `height()` on both children, then recurse. That's O(n log n) on a balanced tree and O(n²) on a skewed one.
- Pitfall: checking only the root. `[1,2,2,3,null,null,3,4,null,null,4]` has equal heights at the root but unbalanced children.
- Pitfall: the rule is about heights, not node counts.
- Short-circuit once a subtree is unbalanced, so you don't keep walking it.
- Follow-up: rebalance a BST (in-order to a sorted array, then build from the middle).
