class Solution {
    public boolean isValidBST(TreeNode root) {
        // long bounds, so nodes holding Integer.MIN_VALUE / MAX_VALUE still fit
        return valid(root, Long.MIN_VALUE, Long.MAX_VALUE);
    }

    // every value in this subtree must lie strictly between low and high
    private boolean valid(TreeNode node, long low, long high) {
        if (node == null) return true;
        if (node.val <= low || node.val >= high) return false;
        // going left caps values at this node; going right floors them here
        return valid(node.left, low, node.val) && valid(node.right, node.val, high);
    }
}
