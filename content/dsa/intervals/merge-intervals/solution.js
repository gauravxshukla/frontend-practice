/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
export default function merge(intervals) {
  // sorted by start, an interval can only overlap the one merged just before it
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result = [];
  for (const [start, end] of sorted) {
    const last = result[result.length - 1];
    // overlapping (or touching): extend; max because it may already reach further
    if (last && start <= last[1]) last[1] = Math.max(last[1], end);
    else result.push([start, end]);
  }
  return result;
}
