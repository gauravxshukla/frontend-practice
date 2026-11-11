class Solution:
    def maxPathSum(self, root: Optional[TreeNode]) -> int:
        best = float("-inf")  # all-negative trees still need their largest node

        # best sum of a path that starts at node and goes down one side
        def gain(node: Optional[TreeNode]) -> int:
            nonlocal best
            if not node:
                return 0
            # a negative branch only hurts, so take 0 (skip it) instead
            left = max(gain(node.left), 0)
            right = max(gain(node.right), 0)
            # the best path that bends at this node uses both sides
            best = max(best, node.val + left + right)
            # a parent can extend through only one side
            return node.val + max(left, right)

        gain(root)
        return best
