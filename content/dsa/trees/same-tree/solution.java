class Solution {
    public boolean isSameTree(TreeNode p, TreeNode q) {
        // two empty subtrees match
        if (p == null && q == null) return true;
        // one empty, or different values, is a mismatch (checked before reading .val)
        if (p == null || q == null || p.val != q.val) return false;
        // the roots match, so both subtree pairs must match too
        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
    }
}
