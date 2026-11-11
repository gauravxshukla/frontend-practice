class Solution:
    def isBalanced(self, root: Optional[TreeNode]) -> bool:
        # height of a subtree, or -1 as soon as any part of it is unbalanced
        def height(node: Optional[TreeNode]) -> int:
            if not node:
                return 0
            left = height(node.left)
            right = height(node.right)
            # pass a failure straight up instead of measuring further
            if left == -1 or right == -1 or abs(left - right) > 1:
                return -1
            return 1 + max(left, right)

        return height(root) != -1
