class Solution {
    public int goodNodes(TreeNode root) {
        return count(root, Integer.MIN_VALUE);
    }

    // count good nodes below, given the largest value on the path from the root
    private int count(TreeNode node, int maxSoFar) {
        if (node == null) return 0;
        // nothing above is bigger (ties are allowed), so this node is good
        int good = node.val >= maxSoFar ? 1 : 0;
        int max = Math.max(maxSoFar, node.val);
        return good + count(node.left, max) + count(node.right, max);
    }
}
