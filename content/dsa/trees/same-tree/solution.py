class Solution:
    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:
        # two empty subtrees match
        if not p and not q:
            return True
        # one empty, or different values, is a mismatch (checked before reading .val)
        if not p or not q or p.val != q.val:
            return False
        # the roots match, so both subtree pairs must match too
        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)
