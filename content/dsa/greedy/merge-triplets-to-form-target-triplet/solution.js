/**
 * @param {number[][]} triplets
 * @param {number[]} target
 * @return {boolean}
 */
export default function mergeTriplets(triplets, target) {
  const found = [false, false, false];

  for (const t of triplets) {
    // A triplet exceeding the target anywhere can never be merged in.
    if (t[0] > target[0] || t[1] > target[1] || t[2] > target[2]) continue;
    for (let k = 0; k < 3; k++) {
      if (t[k] === target[k]) found[k] = true;
    }
  }
  return found[0] && found[1] && found[2];
}
