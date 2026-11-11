class Solution:
    def goodNodes(self, root: TreeNode) -> int:
        # count good nodes below, given the largest value on the path from the root
        def count(node: Optional[TreeNode], max_so_far: float) -> int:
            if not node:
                return 0
            # nothing above is bigger (ties are allowed), so this node is good
            good = 1 if node.val >= max_so_far else 0
            new_max = max(max_so_far, node.val)
            return good + count(node.left, new_max) + count(node.right, new_max)

        return count(root, float("-inf"))
