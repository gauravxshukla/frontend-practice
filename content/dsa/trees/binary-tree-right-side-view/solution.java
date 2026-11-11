class Solution {
    public int[] rightSideView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        List<TreeNode> level = new ArrayList<>(); // every node on the current level, left to right
        if (root != null) level.add(root);
        while (!level.isEmpty()) {
            // the last node of a level is the one visible from the right
            result.add(level.get(level.size() - 1).val);
            List<TreeNode> next = new ArrayList<>();
            for (TreeNode node : level) {
                if (node.left != null) next.add(node.left);
                if (node.right != null) next.add(node.right);
            }
            level = next;
        }
        int[] out = new int[result.size()];
        for (int i = 0; i < out.length; i++) out[i] = result.get(i);
        return out;
    }
}
