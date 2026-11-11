class Solution {
    public int maxDepth(TreeNode root) {
        // an empty subtree adds no levels
        if (root == null) return 0;
        // this node is one level above its deeper child
        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
    }
}
