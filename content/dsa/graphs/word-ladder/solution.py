class Solution:
    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:
        unused = set(wordList)  # dictionary words not reached yet
        if endWord not in unused:
            return 0
        letters = "abcdefghijklmnopqrstuvwxyz"
        level = [beginWord]
        length = 1  # beginWord counts as the first word
        # BFS: every word in round k is k changes from beginWord, so the first hit is shortest
        while level:
            nxt = []
            for word in level:
                if word == endWord:
                    return length
                # neighbours differ in one position; generate them instead of comparing pairs
                for i in range(len(word)):
                    for ch in letters:
                        candidate = word[:i] + ch + word[i + 1 :]
                        if candidate in unused:
                            unused.remove(candidate)  # queued once is enough
                            nxt.append(candidate)
            level = nxt
            length += 1
        return 0
