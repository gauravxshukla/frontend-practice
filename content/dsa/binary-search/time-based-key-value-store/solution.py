class TimeMap:
    def __init__(self):
        # key -> [timestamp, value] pairs, in the order they were set (so sorted by time)
        self.store = {}

    def set(self, key: str, value: str, timestamp: int) -> None:
        if key not in self.store:
            self.store[key] = []
        # timestamps only increase, so appending keeps the list sorted
        self.store[key].append((timestamp, value))

    def get(self, key: str, timestamp: int) -> str:
        entries = self.store.get(key, [])
        result = ""  # nothing set at or before timestamp yet
        l, r = 0, len(entries) - 1
        # find the last entry whose time is <= timestamp
        while l <= r:
            mid = l + (r - l) // 2
            if entries[mid][0] <= timestamp:
                result = entries[mid][1]  # a candidate; a later one may also fit
                l = mid + 1
            else:
                r = mid - 1
        return result
