class DetectSquares:
    def __init__(self):
        self.counts = {}  # (x, y) -> how many times the point was added

    def add(self, point: List[int]) -> None:
        key = (point[0], point[1])
        self.counts[key] = self.counts.get(key, 0) + 1

    def count(self, point: List[int]) -> int:
        x, y = point
        total = 0
        for (px, py), n in self.counts.items():
            # a diagonal corner must differ by the same non-zero amount on both axes
            if abs(px - x) != abs(py - y) or px == x:
                continue
            # the other two corners are then fixed; duplicates multiply the ways
            total += n * self.counts.get((x, py), 0) * self.counts.get((px, y), 0)
        return total
