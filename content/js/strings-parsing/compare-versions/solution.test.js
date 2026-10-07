import compareVersions from './solution.js';

describe('compareVersions', () => {
  test('example: compares parts numerically', () => {
    expect(compareVersions('1.2.0', '1.10.0')).toBe(-1);
    expect(compareVersions('2.0', '1.9.9')).toBe(1);
    expect(compareVersions('1.0', '1.0.0')).toBe(0);
  });

  test('example: works as a sort comparator', () => {
    expect(['1.10', '1.2', '1.9'].sort(compareVersions)).toEqual(['1.2', '1.9', '1.10']);
  });

  test.each([
    ['1.10', '1.9', 1],
    ['1.9', '1.10', -1],
    ['0.0.1', '0.0.2', -1],
    ['3.0.0', '2.99.99', 1],
    ['10.0', '9.0', 1],
  ])('compareVersions(%s, %s) is %i', (a, b, expected) => {
    expect(compareVersions(a, b)).toBe(expected);
  });

  test('identical versions are equal', () => {
    expect(compareVersions('1.2.3', '1.2.3')).toBe(0);
    expect(compareVersions('0', '0')).toBe(0);
  });

  test('missing parts count as 0', () => {
    expect(compareVersions('1', '1.0.0')).toBe(0);
    expect(compareVersions('1.0.0.0', '1')).toBe(0);
    expect(compareVersions('1.0.1', '1')).toBe(1);
    expect(compareVersions('1', '1.0.1')).toBe(-1);
  });

  test('leading zeros are ignored', () => {
    expect(compareVersions('1.01', '1.1')).toBe(0);
    expect(compareVersions('1.002', '1.10')).toBe(-1);
    expect(compareVersions('01.0', '1')).toBe(0);
  });

  test('is antisymmetric', () => {
    const pairs = [['1.2', '1.10'], ['2', '1.9.9'], ['0.1', '0.0.9']];
    for (const [a, b] of pairs) {
      expect(compareVersions(a, b)).toBe(-compareVersions(b, a));
    }
  });

  test('sorts a mixed list', () => {
    const versions = ['1.0.10', '0.9', '1.0.2', '1', '1.0.0.1', '2.0', '1.10'];
    expect(versions.sort(compareVersions)).toEqual([
      '0.9',
      '1',
      '1.0.0.1',
      '1.0.2',
      '1.0.10',
      '1.10',
      '2.0',
    ]);
  });
});
