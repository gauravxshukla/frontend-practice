class Solution:
    def rightSideView(self, root: Optional[TreeNode]) -> List[int]:
        result = []
        if not root:
            return result
        level = [root]  # every node on the current level, left to right
        while level:
            # the last node of a level is the one visible from the right
            result.append(level[-1].val)
            nxt = []
            for node in level:
                if node.left:
                    nxt.append(node.left)
                if node.right:
                    nxt.append(node.right)
            level = nxt
        return result
