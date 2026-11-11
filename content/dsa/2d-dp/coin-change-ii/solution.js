/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
export default function change(amount, coins) {
  // ways[a] = combinations of the coins processed so far that make a
  const ways = new Array(amount + 1).fill(0);
  ways[0] = 1; // one way to make 0: use nothing
  // one coin at a time: combinations are built in coin order, so none is counted twice
  for (const coin of coins) {
    // ascending a lets the same coin be used again
    for (let a = coin; a <= amount; a++) ways[a] += ways[a - coin];
  }
  return ways[amount];
}
