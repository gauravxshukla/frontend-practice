class Solution:
    def findCheapestPrice(self, n: int, flights: List[List[int]], src: int, dst: int, k: int) -> int:
        prices = [float("inf")] * n  # cheapest cost found with the flights allowed so far
        prices[src] = 0
        # round i allows one more flight, so k + 1 rounds allow k stops
        for _ in range(k + 1):
            # extend from last round's costs only, so each round adds at most one flight
            nxt = prices[:]
            for frm, to, price in flights:
                if prices[frm] == float("inf"):
                    continue
                nxt[to] = min(nxt[to], prices[frm] + price)
            prices = nxt
        return -1 if prices[dst] == float("inf") else prices[dst]
