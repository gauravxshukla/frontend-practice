class Solution:
    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:
        # an empty subtree is its own mirror
        if not root:
            return None
        # mirror each side first, then swap them
        left = self.invertTree(root.left)
        root.left = self.invertTree(root.right)
        root.right = left
        return root
