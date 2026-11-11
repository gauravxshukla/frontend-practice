class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        # best profit so far if today ends holding a share, having just sold, or resting (free to buy)
        hold, sold, rest = float("-inf"), 0, 0
        for price in prices:
            # all three use yesterday's values
            new_hold = max(hold, rest - price)  # keep holding, or buy from a rest day
            new_sold = hold + price  # sell what we held
            new_rest = max(rest, sold)  # keep resting, or finish the cooldown
            hold, sold, rest = new_hold, new_sold, new_rest
        # ending while holding a share is never best
        return int(max(sold, rest))
