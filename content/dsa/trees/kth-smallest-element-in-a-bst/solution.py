class Solution:
    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:
        remaining = k  # nodes still to visit before the answer
        answer = None

        # in-order (left, node, right) visits a BST's values smallest first
        def visit(node: Optional[TreeNode]) -> None:
            nonlocal remaining, answer
            if not node or answer is not None:
                return
            visit(node.left)
            if answer is not None:  # found on the left: stop early
                return
            remaining -= 1
            if remaining == 0:
                answer = node.val
                return
            visit(node.right)

        visit(root)
        return answer
