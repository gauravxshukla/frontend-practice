class _TrieNode:
    def __init__(self):
        # children by character, plus whether a word ends here
        self.children = {}
        self.end = False


class Trie:
    def __init__(self):
        self.root = _TrieNode()

    def insert(self, word: str) -> None:
        node = self.root
        # create the missing part of the path, sharing any existing prefix
        for ch in word:
            if ch not in node.children:
                node.children[ch] = _TrieNode()
            node = node.children[ch]
        node.end = True

    # the node reached by following the string, or None if the path breaks
    def _walk(self, s: str) -> Optional[_TrieNode]:
        node = self.root
        for ch in s:
            node = node.children.get(ch)
            if not node:
                return None
        return node

    def search(self, word: str) -> bool:
        # the path must exist and a word must end exactly there
        node = self._walk(word)
        return node is not None and node.end

    def startsWith(self, prefix: str) -> bool:
        # any inserted word continuing this path makes the prefix valid
        return self._walk(prefix) is not None
