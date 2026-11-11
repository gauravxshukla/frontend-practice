/**
 * @param {number[][]} intervals
 * @return {number}
 */
export default function eraseOverlapIntervals(intervals) {
  // the interval ending first leaves the most room for everything after it
  const sorted = [...intervals].sort((a, b) => a[1] - b[1]);
  let removed = 0;
  let lastEnd = -Infinity; // end of the last interval kept
  for (const [start, end] of sorted) {
    // starts at or after the last kept end: keep it (touching is fine)
    if (start >= lastEnd) lastEnd = end;
    // overlaps a kept interval that ends sooner, so this one goes
    else removed++;
  }
  return removed;
}
