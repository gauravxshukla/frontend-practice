class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        if (root == null) return result;
        List<TreeNode> level = new ArrayList<>(); // every node on the current level
        level.add(root);
        while (!level.isEmpty()) {
            List<Integer> values = new ArrayList<>();
            // the next level is every child of this level, left to right
            List<TreeNode> next = new ArrayList<>();
            for (TreeNode node : level) {
                values.add(node.val);
                if (node.left != null) next.add(node.left);
                if (node.right != null) next.add(node.right);
            }
            result.add(values);
            level = next;
        }
        return result;
    }
}
