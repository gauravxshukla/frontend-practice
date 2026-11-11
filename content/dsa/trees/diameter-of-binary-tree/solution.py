class Solution:
    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:
        best = 0

        # returns the height of a subtree, recording the widest path seen on the way
        def height(node: Optional[TreeNode]) -> int:
            nonlocal best
            if not node:
                return 0
            left = height(node.left)
            right = height(node.right)
            # the longest path bending at this node uses both heights (in edges)
            best = max(best, left + right)
            return 1 + max(left, right)

        height(root)
        return best
