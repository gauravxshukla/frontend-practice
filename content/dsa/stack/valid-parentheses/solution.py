class Solution:
    def isValid(self, s: str) -> bool:
        pairs = {")": "(", "]": "[", "}": "{"}  # closer -> the opener it needs
        stack = []  # openers still waiting to be closed
        for ch in s:
            if ch not in pairs:
                stack.append(ch)
            elif not stack or stack.pop() != pairs[ch]:
                # the latest unclosed opener must match (an empty stack fails too)
                return False
        # anything left was opened but never closed
        return not stack
