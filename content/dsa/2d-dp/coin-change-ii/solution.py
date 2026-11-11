class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        # ways[a] = combinations of the coins processed so far that make a
        ways = [0] * (amount + 1)
        ways[0] = 1  # one way to make 0: use nothing
        # one coin at a time: combinations are built in coin order, so none is counted twice
        for coin in coins:
            # ascending a lets the same coin be used again
            for a in range(coin, amount + 1):
                ways[a] += ways[a - coin]
        return ways[amount]
