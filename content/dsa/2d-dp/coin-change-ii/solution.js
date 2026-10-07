/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
export default function change(amount, coins) {
  // ways(i, a) = ways(i - 1, a) + ways(i, a - coins[i - 1]); collapsed to one row.
  // Coins in the OUTER loop so each multiset is counted once (combinations, not orderings).
  const ways = new Array(amount + 1).fill(0);
  ways[0] = 1;
  for (const c of coins) {
    for (let a = c; a <= amount; a++) {
      ways[a] += ways[a - c];
    }
  }
  return ways[amount];
}
