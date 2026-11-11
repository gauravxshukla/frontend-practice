class Solution {
    private Map<Integer, Integer> indexOf; // value -> position in inorder, so each split is found in O(1)
    private int next; // the next preorder value is always the next root to place
    private int[] preorder;

    public TreeNode buildTree(int[] preorder, int[] inorder) {
        this.preorder = preorder;
        indexOf = new HashMap<>();
        for (int i = 0; i < inorder.length; i++) indexOf.put(inorder[i], i);
        next = 0;
        return build(0, inorder.length - 1);
    }

    // builds the subtree whose values occupy inorder[lo..hi]
    private TreeNode build(int lo, int hi) {
        if (lo > hi) return null;
        int value = preorder[next++];
        int mid = indexOf.get(value);
        // preorder lists the whole left subtree before the right, so build left first
        TreeNode left = build(lo, mid - 1);
        TreeNode right = build(mid + 1, hi);
        return new TreeNode(value, left, right);
    }
}
