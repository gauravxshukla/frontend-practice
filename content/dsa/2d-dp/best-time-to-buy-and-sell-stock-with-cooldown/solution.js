/**
 * @param {number[]} prices
 * @return {number}
 */
export default function maxProfit(prices) {
  // Three states at the end of each day:
  //   hold – own a share; sold – sold today (tomorrow is a cooldown); rest – no share, free to buy.
  let hold = -Infinity;
  let sold = 0;
  let rest = 0;
  for (const p of prices) {
    const prevSold = sold;
    sold = hold + p; // sell the share we held
    hold = Math.max(hold, rest - p); // keep holding, or buy (only from rest, never right after a sale)
    rest = Math.max(rest, prevSold); // stay idle, or finish yesterday's cooldown
  }
  return Math.max(sold, rest);
}
