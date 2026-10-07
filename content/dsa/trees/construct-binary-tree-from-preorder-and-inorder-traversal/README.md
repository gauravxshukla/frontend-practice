---
title: Construct Binary Tree from Preorder and Inorder Traversal
type: dsa
difficulty: medium
topic: trees
order: 13
neetcode: true
tags: [trees, recursion, hash-map, divide-and-conquer]
estimatedMinutes: 25
---

You get two arrays, `preorder` and `inorder`, which are the pre-order and in-order traversals of the same binary tree. All values are **unique**. Rebuild the tree and return its root.

Tree nodes are plain objects: `{ val, left, right }`, and a missing child is `null`. Outputs are shown in level order, with `null` marking a missing child.

```js
function buildTree(preorder, inorder) // → root
```

## Examples

```text
Input:  preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]
Output: [3,9,20,null,null,15,7]

Input:  preorder = [-1], inorder = [-1]
Output: [-1]
```

## Constraints

- 1 ≤ `preorder.length` = `inorder.length` ≤ 3000
- −3000 ≤ value ≤ 3000, all values unique
- Both arrays describe the same tree

## Notes

- **Key insight:** `preorder[0]` is the root. Its position in `inorder` splits the in-order array into the left subtree (before it) and the right subtree (after it), and the left part's length tells you how many pre-order entries belong to the left subtree.
- **Optimal:** build a value → index map for `inorder`. Recurse on in-order ranges `[lo, hi]`, taking the next root from a shared pre-order pointer, and build the **left** subtree first. O(n) time, O(n) space.
- **Brute force:** `inorder.indexOf(root)` plus `slice` at each step. That's O(n²) time and copies arrays all over the place, but it's a fine first version.
- Pitfall: building the right subtree before the left one when using a shared pre-order pointer. Pre-order is root, left, right.
- Pitfall: off-by-one in range bounds. Write down `lo..mid-1` and `mid+1..hi` explicitly.
- Unique values matter. With duplicates the tree isn't uniquely determined.
- Follow-up: rebuild from in-order + post-order (take roots from the end and build the right subtree first).
- Follow-up: pre-order + post-order alone doesn't determine a unique tree in general.
