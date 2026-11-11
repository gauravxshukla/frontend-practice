class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        result = []
        if not root:
            return result
        level = [root]  # every node on the current level
        while level:
            result.append([node.val for node in level])
            # the next level is every child of this level, left to right
            nxt = []
            for node in level:
                if node.left:
                    nxt.append(node.left)
                if node.right:
                    nxt.append(node.right)
            level = nxt
        return result
