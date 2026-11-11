class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode node = root;
        while (node != null) {
            // both targets are smaller, so both live in the left subtree
            if (p.val < node.val && q.val < node.val) node = node.left;
            // both are larger, so both live in the right subtree
            else if (p.val > node.val && q.val > node.val) node = node.right;
            // they split here (or one of them is this node): this is the lowest shared ancestor
            else return node;
        }
        return null; // unreachable when p and q are in the tree
    }
}
