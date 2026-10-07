/**
 * @param {number[]} piles bananas in each pile
 * @param {number} h hours available
 * @return {number} the minimum integer eating speed
 */
export default function minEatingSpeed(piles, h) {
  // Hours needed at speed k. This shrinks as k grows, so we can binary search on k.
  const hoursAt = (k) => piles.reduce((sum, p) => sum + Math.ceil(p / k), 0);

  let lo = 1;
  let hi = Math.max(...piles);
  while (lo < hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (hoursAt(mid) <= h) hi = mid; // fast enough, try slower
    else lo = mid + 1; // too slow
  }
  return lo;
}
