class Solution:
    def wordBreak(self, s: str, wordDict: List[str]) -> bool:
        # ok[i]: the first i characters can be split into dictionary words
        ok = [False] * (len(s) + 1)
        ok[0] = True  # the empty prefix needs no words
        for i in range(1, len(s) + 1):
            for w in wordDict:
                # w can be the last word of the prefix if the part before it already splits
                if len(w) <= i and ok[i - len(w)] and s.startswith(w, i - len(w)):
                    ok[i] = True
                    break
        return ok[len(s)]
