class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        # an empty subtree adds no levels
        if not root:
            return 0
        # this node is one level above its deeper child
        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
