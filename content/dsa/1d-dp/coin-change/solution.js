/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
export default function coinChange(coins, amount) {
  // fewest[a] = fewest coins summing to a; fewest[a] = 1 + min over coins c ≤ a of fewest[a - c].
  const fewest = new Array(amount + 1).fill(Infinity);
  fewest[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && fewest[a - c] + 1 < fewest[a]) fewest[a] = fewest[a - c] + 1;
    }
  }
  return fewest[amount] === Infinity ? -1 : fewest[amount];
}
