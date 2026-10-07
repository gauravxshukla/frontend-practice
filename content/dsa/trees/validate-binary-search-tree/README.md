---
title: Validate Binary Search Tree
type: dsa
difficulty: medium
topic: trees
order: 11
neetcode: true
tags: [trees, binary-search-tree, dfs]
estimatedMinutes: 20
---

You get the `root` of a binary tree. Return `true` if it is a valid **binary search tree**: for every node, every value in its left subtree is strictly smaller, and every value in its right subtree is strictly larger. Duplicates are not allowed.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Trees are shown in level order, with `null` marking a missing child.

```js
function isValidBST(root) // → boolean
```

## Examples

```text
Input:  root = [2,1,3]
Output: true

Input:  root = [5,1,4,null,null,3,6]
Output: false
Explanation: 4 is in the right subtree of 5 but is smaller than 5.
```

## Constraints

- 1 ≤ number of nodes ≤ 10⁴
- −2³¹ ≤ `node.val` ≤ 2³¹ − 1

## Notes

- **Key insight:** comparing each node only with its children isn't enough. Every node must fit inside a `(low, high)` window inherited from all its ancestors.
- **Optimal (bounds):** recurse with `(node, low, high)`. Fail if `node.val <= low || node.val >= high`. Go left with `(low, node.val)` and right with `(node.val, high)`. O(n) time, O(h) stack.
- **Alternative (in-order):** an in-order traversal of a valid BST is strictly increasing, so track the previous value and fail on `prev >= cur`.
- **Brute force:** for every node, scan its whole left and right subtrees for the max and min. That's O(n²) on skewed trees.
- Pitfall: `[5,4,6,null,null,3,7]` passes every parent/child check, but 3 sits in the right subtree of 5.
- Pitfall: starting the bounds at a fixed `±2³¹` breaks on values at those limits. Use `±Infinity` (or `null` for "no bound").
- Pitfall: allowing equal values. `[2,2,2]` and `[1,1]` are invalid.
- Follow-up: Recover Binary Search Tree, where exactly two nodes were swapped. Find them with one in-order pass.
