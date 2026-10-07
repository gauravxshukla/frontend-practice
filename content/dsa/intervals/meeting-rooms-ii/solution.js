/**
 * Chronological sweep over sorted start and end times.
 * @param {number[][]} intervals
 * @return {number}
 */
export default function minMeetingRooms(intervals) {
  const starts = intervals.map((m) => m[0]).sort((a, b) => a - b);
  const ends = intervals.map((m) => m[1]).sort((a, b) => a - b);

  let rooms = 0;
  let e = 0;
  for (let s = 0; s < starts.length; s++) {
    if (ends[e] <= starts[s]) {
      e++; // a meeting finished, so reuse its room
    } else {
      rooms++; // everyone is still busy
    }
  }
  return rooms;
}
