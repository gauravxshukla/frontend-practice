/**
 * @param {number[]} hand
 * @param {number} groupSize
 * @return {boolean}
 */
export default function isNStraightHand(hand, groupSize) {
  if (hand.length % groupSize !== 0) return false;

  const count = new Map();
  for (const card of hand) count.set(card, (count.get(card) ?? 0) + 1);
  const values = [...count.keys()].sort((a, b) => a - b);

  for (const v of values) {
    const c = count.get(v);
    if (c === 0) continue;
    // The smallest remaining card must start c groups: v, v+1, ..., v+groupSize-1.
    for (let j = 0; j < groupSize; j++) {
      const have = count.get(v + j) ?? 0;
      if (have < c) return false;
      count.set(v + j, have - c);
    }
  }
  return true;
}
