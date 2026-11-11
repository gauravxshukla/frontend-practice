class MedianFinder:
    def __init__(self):
        self.low = []  # max-heap via negated values: the smaller half
        self.high = []  # min-heap: the larger half

    def addNum(self, num: int) -> None:
        # route through low so the biggest of the small half moves up into high
        heappush(self.low, -num)
        heappush(self.high, -heappop(self.low))
        # keep low the same size as high, or one bigger
        if len(self.high) > len(self.low):
            heappush(self.low, -heappop(self.high))

    def findMedian(self) -> float:
        # odd count: the extra item is low's top
        if len(self.low) > len(self.high):
            return float(-self.low[0])
        return (-self.low[0] + self.high[0]) / 2
