class Solution {
    public boolean isBalanced(TreeNode root) {
        return height(root) != -1;
    }

    // height of a subtree, or -1 as soon as any part of it is unbalanced
    private int height(TreeNode node) {
        if (node == null) return 0;
        int left = height(node.left);
        int right = height(node.right);
        // pass a failure straight up instead of measuring further
        if (left == -1 || right == -1 || Math.abs(left - right) > 1) return -1;
        return 1 + Math.max(left, right);
    }
}
