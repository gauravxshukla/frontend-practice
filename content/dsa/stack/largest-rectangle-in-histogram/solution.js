/**
 * @param {number[]} heights
 * @return {number}
 */
export default function largestRectangleArea(heights) {
  const stack = []; // indices with increasing heights
  let best = 0;
  // i === n acts as a height-0 bar that closes everything left on the stack
  for (let i = 0; i <= heights.length; i++) {
    const h = i === heights.length ? 0 : heights[i];
    // a shorter bar is the right boundary for every taller bar on the stack
    while (stack.length && heights[stack[stack.length - 1]] > h) {
      const height = heights[stack.pop()];
      // the new top is the nearest shorter bar on the left
      const left = stack.length ? stack[stack.length - 1] : -1;
      best = Math.max(best, height * (i - left - 1));
    }
    stack.push(i);
  }
  return best;
}
