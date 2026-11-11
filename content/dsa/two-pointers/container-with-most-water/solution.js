/**
 * @param {number[]} height
 * @return {number}
 */
export default function maxArea(height) {
  let l = 0;
  let r = height.length - 1;
  let best = 0;
  while (l < r) {
    // the shorter line sets the water level across the full width
    best = Math.max(best, Math.min(height[l], height[r]) * (r - l));
    // keeping the shorter line can't beat this area, so drop it
    if (height[l] < height[r]) l++;
    else r--;
  }
  return best;
}
