/**
 * @param {number[]} gas
 * @param {number[]} cost
 * @return {number}
 */
export default function canCompleteCircuit(gas, cost) {
  let total = 0; // net fuel over the whole loop
  let tank = 0; // net fuel since the current candidate start
  let start = 0;

  for (let i = 0; i < gas.length; i++) {
    const diff = gas[i] - cost[i];
    total += diff;
    tank += diff;
    if (tank < 0) {
      // No station in [start, i] can be the answer.
      start = i + 1;
      tank = 0;
    }
  }
  return total >= 0 ? start : -1;
}
