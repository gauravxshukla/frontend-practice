class Solution:
    def lowestCommonAncestor(self, root: "TreeNode", p: "TreeNode", q: "TreeNode") -> "TreeNode":
        node = root
        while node:
            # both targets are smaller, so both live in the left subtree
            if p.val < node.val and q.val < node.val:
                node = node.left
            # both are larger, so both live in the right subtree
            elif p.val > node.val and q.val > node.val:
                node = node.right
            # they split here (or one of them is this node): this is the lowest shared ancestor
            else:
                return node
        return None  # unreachable when p and q are in the tree
