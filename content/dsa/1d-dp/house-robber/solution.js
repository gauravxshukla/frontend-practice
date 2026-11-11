/**
 * @param {number[]} nums
 * @return {number}
 */
export default function rob(nums) {
  let twoBack = 0; // best total up to the house before the previous one
  let oneBack = 0; // best total up to the previous house
  for (const house of nums) {
    // skip this house (keep oneBack) or rob it on top of twoBack
    const best = Math.max(oneBack, twoBack + house);
    twoBack = oneBack;
    oneBack = best;
  }
  return oneBack;
}
