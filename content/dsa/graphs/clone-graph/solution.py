class Solution:
    def cloneGraph(self, node: Optional["Node"]) -> Optional["Node"]:
        copies = {}  # original node -> its clone

        def clone(original: "Node") -> "Node":
            # already cloned (we came back around a cycle): reuse it
            if original in copies:
                return copies[original]
            copy = Node(original.val)
            # register before visiting neighbours so cycles find this clone
            copies[original] = copy
            for nb in original.neighbors:
                copy.neighbors.append(clone(nb))
            return copy

        return clone(node) if node else None
