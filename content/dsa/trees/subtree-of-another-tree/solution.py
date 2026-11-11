class Solution:
    def isSubtree(self, root: Optional[TreeNode], subRoot: Optional[TreeNode]) -> bool:
        # an empty tree is a subtree of anything
        if not subRoot:
            return True
        # ran out of places to start a match
        if not root:
            return False
        # try a match starting here, otherwise look further down either side
        return self.isSame(root, subRoot) or self.isSubtree(root.left, subRoot) or self.isSubtree(root.right, subRoot)

    # two trees match when values and shape match all the way down
    def isSame(self, a: Optional[TreeNode], b: Optional[TreeNode]) -> bool:
        if not a and not b:
            return True
        if not a or not b or a.val != b.val:
            return False
        return self.isSame(a.left, b.left) and self.isSame(a.right, b.right)
