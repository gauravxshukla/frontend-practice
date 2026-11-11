class _TrieNode:
    def __init__(self):
        self.children = {}
        self.word = None  # the word that ends at this node, if any


class Solution:
    def findWords(self, board: List[List[str]], words: List[str]) -> List[str]:
        # one trie for all words; the end node remembers which word it completes
        root = _TrieNode()
        for w in words:
            node = root
            for ch in w:
                if ch not in node.children:
                    node.children[ch] = _TrieNode()
                node = node.children[ch]
            node.word = w

        rows, cols = len(board), len(board[0])
        found = []

        def dfs(r: int, c: int, parent: _TrieNode) -> None:
            ch = board[r][c]
            node = parent.children.get(ch)
            # no word continues with this letter (or the cell is already on the path)
            if not node:
                return
            if node.word is not None:
                found.append(node.word)
                node.word = None  # record each word only once
            # mark the cell as used on the current path, explore, then restore it
            board[r][c] = "#"
            for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nr, nc = r + dr, c + dc
                if 0 <= nr < rows and 0 <= nc < cols:
                    dfs(nr, nc, node)
            board[r][c] = ch

        for r in range(rows):
            for c in range(cols):
                dfs(r, c, root)
        return found
