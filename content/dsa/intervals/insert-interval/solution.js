/**
 * @param {number[][]} intervals sorted by start, non-overlapping
 * @param {number[]} newInterval
 * @return {number[][]}
 */
export default function insert(intervals, newInterval) {
  const result = [];
  let [start, end] = newInterval;
  let i = 0;
  // 1. intervals that end before the new one starts are untouched
  while (i < intervals.length && intervals[i][1] < start) result.push(intervals[i++]);
  // 2. every interval overlapping (or touching) the new one merges into it
  while (i < intervals.length && intervals[i][0] <= end) {
    start = Math.min(start, intervals[i][0]);
    end = Math.max(end, intervals[i][1]);
    i++;
  }
  result.push([start, end]);
  // 3. the rest start after the merged interval ends
  while (i < intervals.length) result.push(intervals[i++]);
  return result;
}
