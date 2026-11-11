class Solution:
    def isValidBST(self, root: Optional[TreeNode]) -> bool:
        # every value in this subtree must lie strictly between low and high
        def valid(node: Optional[TreeNode], low: float, high: float) -> bool:
            if not node:
                return True
            if node.val <= low or node.val >= high:
                return False
            # going left caps values at this node; going right floors them here
            return valid(node.left, low, node.val) and valid(node.right, node.val, high)

        return valid(root, float("-inf"), float("inf"))
