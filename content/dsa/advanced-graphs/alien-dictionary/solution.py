class Solution:
    def alienOrder(self, words: List[str]) -> str:
        # every letter that appears must be in the answer, even with no rules
        after = {}  # letter -> letters that must come after it
        needs = {}  # letter -> how many letters must come before it
        for w in words:
            for ch in w:
                if ch not in after:
                    after[ch] = set()
                    needs[ch] = 0
        for i in range(len(words) - 1):
            a, b = words[i], words[i + 1]
            # a longer word before its own prefix can't be sorted by any order
            if len(a) > len(b) and a.startswith(b):
                return ""
            # only the first differing letter tells us anything
            for j in range(min(len(a), len(b))):
                if a[j] != b[j]:
                    if b[j] not in after[a[j]]:
                        after[a[j]].add(b[j])
                        needs[b[j]] += 1
                    break
        # Kahn's topological sort: emit letters once nothing must precede them
        ready = [ch for ch in needs if needs[ch] == 0]
        order = []
        while ready:
            ch = ready.pop()
            order.append(ch)
            for nxt in after[ch]:
                needs[nxt] -= 1
                if needs[nxt] == 0:
                    ready.append(nxt)
        # letters left out are on a cycle of contradictory rules
        return "".join(order) if len(order) == len(after) else ""
