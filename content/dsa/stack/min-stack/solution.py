class MinStack:
    def __init__(self):
        # each entry is (value, smallest value at or below this height)
        self.stack = []

    def push(self, val: int) -> None:
        # the new minimum is the smaller of val and the minimum beneath it
        current = min(val, self.getMin()) if self.stack else val
        self.stack.append((val, current))

    def pop(self) -> None:
        # the pair below already holds the previous minimum, so nothing to recompute
        self.stack.pop()

    def top(self) -> int:
        return self.stack[-1][0]

    def getMin(self) -> int:
        return self.stack[-1][1]
