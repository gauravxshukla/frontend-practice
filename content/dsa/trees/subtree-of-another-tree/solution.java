class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        // an empty tree is a subtree of anything
        if (subRoot == null) return true;
        // ran out of places to start a match
        if (root == null) return false;
        // try a match starting here, otherwise look further down either side
        return isSame(root, subRoot) || isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
    }

    // two trees match when values and shape match all the way down
    private boolean isSame(TreeNode a, TreeNode b) {
        if (a == null && b == null) return true;
        if (a == null || b == null || a.val != b.val) return false;
        return isSame(a.left, b.left) && isSame(a.right, b.right);
    }
}
