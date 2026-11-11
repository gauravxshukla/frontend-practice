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

- **Identify:** rebuild a tree from preorder + inorder → preorder gives roots, inorder splits left/right
- **Key formula:** left subtree size = inorder index of root − inorder start
- **Brute force:** search inorder for each root and slice new arrays every call, O(n²)
- **Insight:** a value → inorder index map finds each split in O(1), and a preorder pointer avoids slicing
- **Steps:** build(lo, hi): root = preorder[p++]; mid = index[root]; left = build(lo, mid − 1); right = build(mid + 1, hi)
- **Complexity:** O(n²) → O(n) time, O(n) space
- **Pitfall:** build the left subtree before the right, because preorder lists left nodes first
- **Related:** Serialize and Deserialize Binary Tree, Maximum Depth of Binary Tree, Validate Binary Search Tree
