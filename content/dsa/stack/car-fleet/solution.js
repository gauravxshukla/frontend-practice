/**
 * @param {number} target
 * @param {number[]} position
 * @param {number[]} speed
 * @return {number}
 */
export default function carFleet(target, position, speed) {
  // Sort cars from closest-to-target to farthest.
  const cars = position.map((p, i) => [p, speed[i]]).sort((a, b) => b[0] - a[0]);

  let fleets = 0;
  let slowestArrival = 0; // arrival time of the fleet directly ahead
  for (const [p, s] of cars) {
    const arrival = (target - p) / s;
    // A car that would arrive later can't catch the fleet ahead: it leads a new fleet.
    // Otherwise it catches up and merges (arriving at the fleet's time).
    if (arrival > slowestArrival) {
      fleets++;
      slowestArrival = arrival;
    }
  }
  return fleets;
}
