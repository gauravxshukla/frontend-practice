/**
 * @param {number} target
 * @param {number[]} position
 * @param {number[]} speed
 * @return {number}
 */
export default function carFleet(target, position, speed) {
  // cars closest to the target decide whether those behind can catch up
  const cars = position.map((p, i) => [p, speed[i]]).sort((a, b) => b[0] - a[0]);
  const fleets = []; // arrival time of each fleet, nearest fleet first
  for (const [p, s] of cars) {
    const time = (target - p) / s;
    // slower to arrive than the fleet ahead means it can't catch it: a new fleet
    if (!fleets.length || time > fleets[fleets.length - 1]) fleets.push(time);
    // otherwise it catches up and moves at that fleet's pace
  }
  return fleets.length;
}
