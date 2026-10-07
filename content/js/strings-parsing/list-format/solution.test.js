import listFormat from './solution.js';

describe('listFormat', () => {
  test('example: formats zero, one, two and many items', () => {
    expect(listFormat([])).toBe('');
    expect(listFormat(['Bob'])).toBe('Bob');
    expect(listFormat(['Bob', 'Alice'])).toBe('Bob and Alice');
    expect(listFormat(['Bob', 'Ben', 'Tim', 'Jane', 'John'])).toBe('Bob, Ben, Tim, Jane and John');
  });

  test('example: length truncates with "others"', () => {
    const names = ['Bob', 'Ben', 'Tim', 'Jane', 'John'];
    expect(listFormat(names, { length: 3 })).toBe('Bob, Ben, Tim and 2 others');
    expect(listFormat(['Bob', 'Ben', 'Tim', 'Jane'], { length: 3 })).toBe('Bob, Ben, Tim and 1 other');
  });

  test('three items', () => {
    expect(listFormat(['a', 'b', 'c'])).toBe('a, b and c');
  });

  test('removes empty strings', () => {
    expect(listFormat(['a', '', 'b', ''])).toBe('a and b');
    expect(listFormat(['', ''])).toBe('');
    expect(listFormat(['', 'x'])).toBe('x');
  });

  test('unique keeps the first occurrence', () => {
    expect(listFormat(['Bob', 'Ben', 'Bob', 'Ben'], { unique: true })).toBe('Bob and Ben');
    expect(listFormat(['b', 'a', 'b', 'c', 'a'], { unique: true })).toBe('b, a and c');
  });

  test('duplicates are kept without unique', () => {
    expect(listFormat(['Bob', 'Bob'])).toBe('Bob and Bob');
  });

  test('sorted sorts the items', () => {
    expect(listFormat(['Bob', 'Ben', 'Tim'], { sorted: true })).toBe('Ben, Bob and Tim');
  });

  test('length of 1 shows one item', () => {
    expect(listFormat(['a', 'b', 'c'], { length: 1 })).toBe('a and 2 others');
    expect(listFormat(['a', 'b'], { length: 1 })).toBe('a and 1 other');
  });

  test.each([
    [3, 'a, b and c'],
    [5, 'a, b and c'],
    [0, 'a, b and c'],
    [-2, 'a, b and c'],
  ])('ignores length %i when it does not truncate', (length, expected) => {
    expect(listFormat(['a', 'b', 'c'], { length })).toBe(expected);
  });

  test('combines unique, sorted and length in that order', () => {
    const items = ['Tim', 'Bob', '', 'Tim', 'Ann', 'Bob', 'Zed'];
    expect(listFormat(items, { unique: true, sorted: true, length: 2 })).toBe('Ann, Bob and 2 others');
    expect(listFormat(items, { unique: true, length: 3 })).toBe('Tim, Bob, Ann and 1 other');
  });

  test('does not mutate the input', () => {
    const items = ['c', 'a', 'b', 'a'];
    listFormat(items, { sorted: true, unique: true, length: 1 });
    expect(items).toEqual(['c', 'a', 'b', 'a']);
  });
});
