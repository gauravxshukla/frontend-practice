/**
 * @param {number[][]} intervals
 * @return {boolean}
 */
export default function canAttendMeetings(intervals) {
  // sorted by start, only neighbours can overlap
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  for (let i = 1; i < sorted.length; i++) {
    // starting before the previous meeting ends is a clash (ending exactly then is fine)
    if (sorted[i][0] < sorted[i - 1][1]) return false;
  }
  return true;
}
