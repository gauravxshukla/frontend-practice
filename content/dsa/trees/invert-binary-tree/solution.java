class Solution {
    public TreeNode invertTree(TreeNode root) {
        // an empty subtree is its own mirror
        if (root == null) return null;
        // mirror each side first, then swap them
        TreeNode left = invertTree(root.left);
        root.left = invertTree(root.right);
        root.right = left;
        return root;
    }
}
