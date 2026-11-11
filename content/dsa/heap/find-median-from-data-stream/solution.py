class MedianFinder:

    def __init__(self):
        # Max-heap (negated) for the lower half, min-heap for the upper half.
        self.low, self.high = [], []

    def addNum(self, num: int) -> None:
        heappush(self.low, -num)
        heappush(self.high, -heappop(self.low))
        if len(self.high) > len(self.low):
            heappush(self.low, -heappop(self.high))

    def findMedian(self) -> float:
        if len(self.low) > len(self.high):
            return -self.low[0]
        return (-self.low[0] + self.high[0]) / 2
