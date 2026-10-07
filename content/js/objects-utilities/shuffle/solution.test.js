import shuffle from './solution.js';

const sequence = (values) => {
  let k = 0;
  return () => values[k++];
};

describe('shuffle', () => {
  test('example: returns a permutation of the input', () => {
    const result = shuffle([1, 2, 3, 4, 5]);
    expect(result).toHaveLength(5);
    expect([...result].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5]);
  });

  test('example: follows Fisher-Yates exactly for a fixed random sequence', () => {
    expect(shuffle([1, 2, 3, 4], sequence([0.5, 0.1, 0.9]))).toEqual([4, 2, 1, 3]);
  });

  test('random always 0 rotates the first element to the end', () => {
    expect(shuffle([1, 2, 3, 4], () => 0)).toEqual([2, 3, 4, 1]);
  });

  test('random close to 1 leaves the order unchanged', () => {
    expect(shuffle([1, 2, 3, 4], () => 0.999999)).toEqual([1, 2, 3, 4]);
  });

  test('calls random once per index from the last down to 1', () => {
    const random = jest.fn(() => 0.3);
    shuffle(['a', 'b', 'c', 'd', 'e'], random);
    expect(random).toHaveBeenCalledTimes(4);
  });

  test('does not mutate the input and returns a new array', () => {
    const input = [1, 2, 3, 4, 5];
    const result = shuffle(input, () => 0);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect(result).not.toBe(input);
  });

  test('empty and single-element arrays', () => {
    const random = jest.fn(() => 0);
    const single = [7];
    expect(shuffle([], random)).toEqual([]);
    expect(shuffle(single, random)).toEqual([7]);
    expect(shuffle(single, random)).not.toBe(single);
    expect(random).not.toHaveBeenCalled();
  });

  test('every permutation of [1, 2, 3] is roughly equally likely', () => {
    const runs = 6000;
    const counts = {};
    for (let i = 0; i < runs; i++) {
      const key = shuffle([1, 2, 3]).join('');
      counts[key] = (counts[key] || 0) + 1;
    }
    expect(Object.keys(counts).sort()).toEqual(['123', '132', '213', '231', '312', '321']);
    for (const key of Object.keys(counts)) {
      // Expected 1000 each; allow ±25%.
      expect(counts[key]).toBeGreaterThan(750);
      expect(counts[key]).toBeLessThan(1250);
    }
  });
});
