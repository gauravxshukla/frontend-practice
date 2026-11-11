class _TrieNode:
    def __init__(self):
        # children by character, plus whether a word ends here
        self.children = {}
        self.end = False


class WordDictionary:
    def __init__(self):
        self.root = _TrieNode()

    def addWord(self, word: str) -> None:
        node = self.root
        for ch in word:
            if ch not in node.children:
                node.children[ch] = _TrieNode()
            node = node.children[ch]
        node.end = True

    def search(self, word: str) -> bool:
        # does word[i:] match some path starting at node?
        def match(i: int, node: _TrieNode) -> bool:
            # the pattern is used up: it matches only if a word ends here
            if i == len(word):
                return node.end
            ch = word[i]
            if ch == ".":
                # a wildcard may be any child, so try each one
                for child in node.children.values():
                    if match(i + 1, child):
                        return True
                return False
            # a fixed letter has exactly one place to go
            child = node.children.get(ch)
            return child is not None and match(i + 1, child)

        return match(0, self.root)
