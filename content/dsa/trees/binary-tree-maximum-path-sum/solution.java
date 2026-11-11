class Solution {
    private int best;

    public int maxPathSum(TreeNode root) {
        best = Integer.MIN_VALUE; // all-negative trees still need their largest node
        gain(root);
        return best;
    }

    // best sum of a path that starts at node and goes down one side
    private int gain(TreeNode node) {
        if (node == null) return 0;
        // a negative branch only hurts, so take 0 (skip it) instead
        int left = Math.max(gain(node.left), 0);
        int right = Math.max(gain(node.right), 0);
        // the best path that bends at this node uses both sides
        best = Math.max(best, node.val + left + right);
        // a parent can extend through only one side
        return node.val + Math.max(left, right);
    }
}
