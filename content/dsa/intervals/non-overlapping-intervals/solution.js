/**
 * @param {number[][]} intervals
 * @return {number}
 */
export default function eraseOverlapIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let prevEnd = -Infinity;

  for (const [start, end] of sorted) {
    if (start >= prevEnd) {
      prevEnd = end; // keep it: it ends earliest among what's left
    } else {
      removed++;
    }
  }
  return removed;
}
