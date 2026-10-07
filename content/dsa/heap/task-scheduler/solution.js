// Array-backed binary heap. `before(a, b)` returns true when a should sit above b.
class Heap {
  constructor(before) {
    this.before = before;
    this.data = [];
  }
  get size() {
    return this.data.length;
  }
  peek() {
    return this.data[0];
  }
  push(value) {
    const a = this.data;
    a.push(value);
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.before(a[i], a[parent])) break;
      [a[parent], a[i]] = [a[i], a[parent]];
      i = parent;
    }
  }
  pop() {
    const a = this.data;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      let i = 0;
      while (true) {
        const l = 2 * i + 1;
        const r = l + 1;
        let best = i;
        if (l < a.length && this.before(a[l], a[best])) best = l;
        if (r < a.length && this.before(a[r], a[best])) best = r;
        if (best === i) break;
        [a[best], a[i]] = [a[i], a[best]];
        i = best;
      }
    }
    return top;
  }
}

/**
 * @param {string[]} tasks single uppercase letters
 * @param {number} n cooldown between two runs of the same task
 * @return {number} the minimum number of time units
 */
export default function leastInterval(tasks, n) {
  const counts = new Map();
  for (const t of tasks) counts.set(t, (counts.get(t) ?? 0) + 1);

  // Max-heap of remaining counts: always run the task with the most work left.
  const ready = new Heap((a, b) => a > b);
  for (const c of counts.values()) ready.push(c);

  const cooling = []; // FIFO of [remainingCount, timeItIsReadyAgain]
  let time = 0;
  while (ready.size || cooling.length) {
    time++;
    if (ready.size) {
      const left = ready.pop() - 1;
      if (left > 0) cooling.push([left, time + n]);
    } else {
      // Nothing is ready: jump straight to when the next task comes off cooldown.
      time = cooling[0][1];
    }
    if (cooling.length && cooling[0][1] === time) ready.push(cooling.shift()[0]);
  }
  return time;
}
