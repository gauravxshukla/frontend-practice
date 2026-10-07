import pipeAsync from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('pipeAsync', () => {
  test('example: runs async and sync functions left to right', async () => {
    const getUser = async (id) => ({ id, name: 'Ada' });
    const getName = (user) => user.name;
    const shout = async (s) => s.toUpperCase();
    await expect(pipeAsync(getUser, getName, shout)(1)).resolves.toBe('ADA');
  });

  test('example: with no functions it resolves to the input', async () => {
    await expect(pipeAsync()(5)).resolves.toBe(5);
  });

  test('applies functions left to right, not right to left', async () => {
    const run = pipeAsync(
      (s) => `${s}a`,
      async (s) => `${s}b`,
      (s) => `${s}c`,
    );
    await expect(run('>')).resolves.toBe('>abc');
  });

  test('each function receives the awaited value, not a promise', async () => {
    const second = jest.fn((x) => x * 2);
    const run = pipeAsync(async (x) => {
      await sleep(10);
      return x + 1;
    }, second);
    await expect(run(1)).resolves.toBe(4);
    expect(second).toHaveBeenCalledWith(2);
  });

  test('waits for each step before starting the next', async () => {
    const log = [];
    const run = pipeAsync(
      async (x) => {
        await sleep(20);
        log.push('slow done');
        return x;
      },
      (x) => {
        log.push('next started');
        return x;
      },
    );
    await run(0);
    expect(log).toEqual(['slow done', 'next started']);
  });

  test('stops at the first rejection and skips the rest', async () => {
    const after = jest.fn((x) => x);
    const run = pipeAsync(
      (x) => x + 1,
      () => Promise.reject(new Error('step 2 failed')),
      after,
    );
    await expect(run(1)).rejects.toThrow('step 2 failed');
    expect(after).not.toHaveBeenCalled();
  });

  test('a synchronous throw becomes a rejection', async () => {
    const run = pipeAsync(() => {
      throw new Error('sync throw');
    });
    let result;
    expect(() => {
      result = run(1);
    }).not.toThrow();
    await expect(result).rejects.toThrow('sync throw');
  });

  test('always returns a promise, even when every step is synchronous', async () => {
    const result = pipeAsync((x) => x + 1)(1);
    expect(result).toBeInstanceOf(Promise);
    await expect(result).resolves.toBe(2);
  });

  test('the pipeline can be reused', async () => {
    const run = pipeAsync(async (x) => x * 10, (x) => x + 1);
    await expect(run(1)).resolves.toBe(11);
    await expect(run(2)).resolves.toBe(21);
  });
});
