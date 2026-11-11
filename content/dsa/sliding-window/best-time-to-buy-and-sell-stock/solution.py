class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        min_price = float("inf")  # cheapest buy seen so far
        best = 0  # never negative: not trading is allowed
        for price in prices:
            # a lower price is a better buy for every later day
            min_price = min(min_price, price)
            # selling today against the cheapest earlier buy
            best = max(best, price - min_price)
        return best
