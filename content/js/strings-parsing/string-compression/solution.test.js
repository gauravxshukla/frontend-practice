import rle from './solution.js';

describe('string compression (run-length encoding)', () => {
  test('example: encode writes counts only for runs longer than 1', () => {
    expect(rle.encode('aaabccdddd')).toBe('a3bc2d4');
    expect(rle.encode('abc')).toBe('abc');
  });

  test('example: decode reverses encode, including multi-digit counts', () => {
    expect(rle.decode('a3bc2d4')).toBe('aaabccdddd');
    expect(rle.decode('a12')).toBe('aaaaaaaaaaaa');
  });

  test('empty string', () => {
    expect(rle.encode('')).toBe('');
    expect(rle.decode('')).toBe('');
  });

  test('encodes multi-digit runs', () => {
    expect(rle.encode('a'.repeat(12))).toBe('a12');
    expect(rle.encode(`${'x'.repeat(100)}y`)).toBe('x100y');
  });

  test('only consecutive characters form a run', () => {
    expect(rle.encode('aba')).toBe('aba');
    expect(rle.encode('aabbaa')).toBe('a2b2a2');
  });

  test('case, spaces and punctuation are ordinary characters', () => {
    expect(rle.encode('aaAA  !!!')).toBe('a2A2 2!3');
    expect(rle.decode('a2A2 2!3')).toBe('aaAA  !!!');
  });

  test('single characters', () => {
    expect(rle.encode('z')).toBe('z');
    expect(rle.decode('z')).toBe('z');
  });

  test('decode handles a mix of counted and uncounted characters', () => {
    expect(rle.decode('ab10c')).toBe(`a${'b'.repeat(10)}c`);
    expect(rle.decode('x1y2')).toBe('xyy');
  });

  test.each([
    ['aaabccdddd'],
    ['hello  world!!'],
    ['abcabc'],
    ['ZZZzzz...---'],
    ['q'.repeat(25) + 'r' + 's'.repeat(10)],
  ])('round-trips %s', (input) => {
    expect(rle.decode(rle.encode(input))).toBe(input);
  });

  test('round-trips generated strings', () => {
    const alphabet = 'ab c';
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed;
    };
    for (let n = 0; n < 50; n++) {
      let input = '';
      const runs = random() % 8;
      for (let r = 0; r < runs; r++) {
        input += alphabet[random() % alphabet.length].repeat(1 + (random() % 13));
      }
      expect(rle.decode(rle.encode(input))).toBe(input);
    }
  });
});
