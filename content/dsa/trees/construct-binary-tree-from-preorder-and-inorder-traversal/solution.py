class Solution:
    def buildTree(self, preorder: List[int], inorder: List[int]) -> Optional[TreeNode]:
        # value -> position in inorder, so each split is found in O(1)
        index_of = {value: i for i, value in enumerate(inorder)}
        nxt = 0  # the next preorder value is always the next root to place

        # builds the subtree whose values occupy inorder[lo..hi]
        def build(lo: int, hi: int) -> Optional[TreeNode]:
            nonlocal nxt
            if lo > hi:
                return None
            value = preorder[nxt]
            nxt += 1
            mid = index_of[value]
            # preorder lists the whole left subtree before the right, so build left first
            left = build(lo, mid - 1)
            right = build(mid + 1, hi)
            return TreeNode(value, left, right)

        return build(0, len(inorder) - 1)
