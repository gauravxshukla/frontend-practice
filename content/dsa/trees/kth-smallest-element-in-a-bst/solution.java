class Solution {
    private int remaining; // nodes still to visit before the answer
    private Integer answer;

    public int kthSmallest(TreeNode root, int k) {
        remaining = k;
        answer = null;
        visit(root);
        return answer;
    }

    // in-order (left, node, right) visits a BST's values smallest first
    private void visit(TreeNode node) {
        if (node == null || answer != null) return;
        visit(node.left);
        if (answer != null) return; // found on the left: stop early
        remaining--;
        if (remaining == 0) {
            answer = node.val;
            return;
        }
        visit(node.right);
    }
}
