class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        # dp[a] = fewest coins that make amount a (inf = impossible so far)
        dp = [float("inf")] * (amount + 1)
        dp[0] = 0  # zero coins make zero
        for a in range(1, amount + 1):
            for c in coins:
                # using coin c last leaves a - c, whose best answer is already known
                if c <= a and dp[a - c] + 1 < dp[a]:
                    dp[a] = dp[a - c] + 1
        return -1 if dp[amount] == float("inf") else dp[amount]
