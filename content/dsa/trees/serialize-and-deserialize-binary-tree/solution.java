class Codec {
    // Preorder with "#" for empty children.
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        write(root, sb);
        return sb.toString();
    }

    private void write(TreeNode node, StringBuilder sb) {
        if (sb.length() > 0) sb.append(',');
        if (node == null) {
            sb.append('#');
            return;
        }
        sb.append(node.val);
        write(node.left, sb);
        write(node.right, sb);
    }

    public TreeNode deserialize(String data) {
        return build(new ArrayDeque<>(Arrays.asList(data.split(","))));
    }

    private TreeNode build(Deque<String> tokens) {
        String token = tokens.poll();
        if (token == null || token.equals("#")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(token));
        node.left = build(tokens);
        node.right = build(tokens);
        return node;
    }
}
