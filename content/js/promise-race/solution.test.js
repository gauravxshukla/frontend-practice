import promiseRace from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (reason, ms) => new Promise((_, reject) => setTimeout(() => reject(reason), ms));

describe('promiseRace', () => {
  test('resolves with the fastest', async () => {
    expect(await promiseRace([delay('slow', 40), delay('fast', 5)])).toBe('fast');
  });

  test('rejects if the fastest rejects', async () => {
    let reason;
    try {
      await promiseRace([delay('slow', 40), fail('boom', 5)]);
    } catch (e) {
      reason = e;
    }
    expect(reason).toBe('boom');
  });

  test('plain values win immediately', async () => {
    expect(await promiseRace([delay('slow', 20), 'now'])).toBe('now');
  });
});
