/**
 * @param {number[][]} intervals
 * @return {number}
 */
export default function minMeetingRooms(intervals) {
  // only the order of start and end times matters, not which meeting they belong to
  const starts = intervals.map((iv) => iv[0]).sort((a, b) => a - b);
  const ends = intervals.map((iv) => iv[1]).sort((a, b) => a - b);
  let rooms = 0;
  let e = 0; // earliest end time not yet used to free a room
  for (const start of starts) {
    // a meeting has already finished: reuse its room
    if (start >= ends[e]) e++;
    // every room is still busy: open a new one
    else rooms++;
  }
  return rooms;
}
