---
title: Same Tree
type: dsa
difficulty: easy
topic: trees
order: 5
neetcode: true
tags: [trees, recursion, dfs]
estimatedMinutes: 10
---

You get the roots of two binary trees, `p` and `q`. Return `true` if they are identical: the same shape, with equal values in matching positions. Two empty trees are identical.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function isSameTree(p, q) // → boolean
```

## Examples

```text
Input:  p = [1,2,3], q = [1,2,3]
Output: true

Input:  p = [1,2], q = [1,null,2]
Output: false
Explanation: the 2 is a left child in p but a right child in q.

Input:  p = [1,2,1], q = [1,1,2]
Output: false
```

## Constraints

- 0 ≤ number of nodes in each tree ≤ 100
- −10⁴ ≤ `node.val` ≤ 10⁴

## Notes

- **Key insight:** two trees are equal when their roots match and both pairs of subtrees are equal.
- **Recursive:** both null → `true`; exactly one null or different values → `false`; otherwise recurse on `(p.left, q.left)` and `(p.right, q.right)`. O(min(n, m)) time, O(h) stack.
- **Iterative:** a queue (or stack) of node pairs, checked the same way. This avoids deep recursion.
- **Brute force:** serialize both trees, including null markers, and compare the strings. Still O(n), but it uses more memory and is easy to get wrong if you leave out the nulls.
- Pitfall: comparing only the values in traversal order. `[1,2]` and `[1,null,2]` have the same pre-order values but different shapes.
- Pitfall: reading `p.val` before checking that `p` exists.
- Follow-up: Symmetric Tree, which compares a tree with its own mirror (`left.left` with `right.right`).
