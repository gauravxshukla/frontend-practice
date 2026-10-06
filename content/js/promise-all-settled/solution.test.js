import promiseAllSettled from './solution.js';

const delay = (value, ms) => new Promise((resolve) => setTimeout(() => resolve(value), ms));

describe('promiseAllSettled', () => {
  test('empty input', async () => {
    expect(await promiseAllSettled([])).toEqual([]);
  });

  test('mixed outcomes in input order', async () => {
    expect(await promiseAllSettled([delay(1, 20), Promise.reject('x'), 3])).toEqual([
      { status: 'fulfilled', value: 1 },
      { status: 'rejected', reason: 'x' },
      { status: 'fulfilled', value: 3 },
    ]);
  });

  test('never rejects when everything fails', async () => {
    const result = await promiseAllSettled([Promise.reject(1), Promise.reject(2)]);
    expect(result.map((r) => r.status)).toEqual(['rejected', 'rejected']);
  });
});
