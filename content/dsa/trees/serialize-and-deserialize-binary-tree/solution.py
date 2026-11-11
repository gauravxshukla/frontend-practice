class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        out = []

        # preorder: node, then left, then right; "#" marks a missing child
        def write(node: Optional[TreeNode]) -> None:
            if not node:
                out.append("#")
                return
            out.append(str(node.val))
            write(node.left)
            write(node.right)

        write(root)
        return ",".join(out)

    def deserialize(self, data: str) -> Optional[TreeNode]:
        tokens = data.split(",")
        i = 0

        # read tokens back in the same preorder they were written
        def read() -> Optional[TreeNode]:
            nonlocal i
            token = tokens[i]
            i += 1
            if token == "#":
                return None
            node = TreeNode(int(token))
            node.left = read()
            node.right = read()
            return node

        return read()
