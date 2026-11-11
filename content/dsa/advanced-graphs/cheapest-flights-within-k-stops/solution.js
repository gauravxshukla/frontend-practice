/**
 * @param {number} n
 * @param {number[][]} flights [from, to, price]
 * @param {number} src
 * @param {number} dst
 * @param {number} k max stops (so at most k + 1 flights)
 * @return {number}
 */
export default function findCheapestPrice(n, flights, src, dst, k) {
  let prices = new Array(n).fill(Infinity); // cheapest cost found with the flights allowed so far
  prices[src] = 0;
  // round i allows one more flight, so k + 1 rounds allow k stops
  for (let round = 0; round <= k; round++) {
    // extend from last round's costs only, so each round adds at most one flight
    const next = [...prices];
    for (const [from, to, price] of flights) {
      if (prices[from] === Infinity) continue;
      next[to] = Math.min(next[to], prices[from] + price);
    }
    prices = next;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}
