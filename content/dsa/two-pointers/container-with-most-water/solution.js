/**
 * @param {number[]} height
 * @return {number}
 */
export default function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const area = (right - left) * Math.min(height[left], height[right]);
    best = Math.max(best, area);
    // The shorter wall limits the area, so moving it is the only move that can help.
    if (height[left] < height[right]) left++;
    else right--;
  }
  return best;
}
