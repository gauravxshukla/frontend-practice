class Solution {
    private int best;

    public int diameterOfBinaryTree(TreeNode root) {
        best = 0;
        height(root);
        return best;
    }

    // returns the height of a subtree, recording the widest path seen on the way
    private int height(TreeNode node) {
        if (node == null) return 0;
        int left = height(node.left);
        int right = height(node.right);
        // the longest path bending at this node uses both heights (in edges)
        best = Math.max(best, left + right);
        return 1 + Math.max(left, right);
    }
}
