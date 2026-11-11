class Codec {
    public String serialize(TreeNode root) {
        StringBuilder out = new StringBuilder();
        write(root, out);
        return out.toString();
    }

    // preorder: node, then left, then right; "#" marks a missing child
    private void write(TreeNode node, StringBuilder out) {
        if (out.length() > 0) out.append(',');
        if (node == null) {
            out.append('#');
            return;
        }
        out.append(node.val);
        write(node.left, out);
        write(node.right, out);
    }

    private String[] tokens;
    private int i;

    public TreeNode deserialize(String data) {
        tokens = data.split(",");
        i = 0;
        return read();
    }

    // read tokens back in the same preorder they were written
    private TreeNode read() {
        String token = tokens[i++];
        if (token.equals("#")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(token));
        node.left = read();
        node.right = read();
        return node;
    }
}
