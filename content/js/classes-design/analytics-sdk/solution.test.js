import Analytics from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const names = (batch) => batch.map((e) => e.event);

describe('Analytics', () => {
  let analytics;

  afterEach(() => {
    analytics?.destroy();
    analytics = undefined;
  });

  test('example: sends a batch as soon as batchSize is reached', async () => {
    const send = jest.fn(() => Promise.resolve());
    analytics = new Analytics({ send, batchSize: 2, flushInterval: 1000 });
    analytics.track('view', { page: '/' });
    analytics.track('click', { id: 'buy' });
    await sleep(0);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith([
      { event: 'view', props: { page: '/' } },
      { event: 'click', props: { id: 'buy' } },
    ]);
  });

  test('example: sends a partial batch after flushInterval', async () => {
    const send = jest.fn(() => Promise.resolve());
    analytics = new Analytics({ send, batchSize: 5, flushInterval: 20 });
    analytics.track('view');
    await sleep(5);
    expect(send).not.toHaveBeenCalled();
    await sleep(60);
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith([{ event: 'view', props: {} }]);
  });

  test('flush sends everything now, in batches of batchSize, and resolves true', async () => {
    const send = jest.fn(() => Promise.resolve());
    analytics = new Analytics({ send, batchSize: 2, flushInterval: 1000 });
    analytics.track('a');
    analytics.track('b');
    analytics.track('c');
    analytics.track('d');
    analytics.track('e');
    await expect(analytics.flush()).resolves.toBe(true);
    expect(send.mock.calls.map(([batch]) => names(batch))).toEqual([['a', 'b'], ['c', 'd'], ['e']]);
  });

  test('flush with an empty buffer does not call send', async () => {
    const send = jest.fn(() => Promise.resolve());
    analytics = new Analytics({ send });
    await expect(analytics.flush()).resolves.toBe(true);
    expect(send).not.toHaveBeenCalled();
  });

  test('a manual flush cancels the pending timer', async () => {
    const send = jest.fn(() => Promise.resolve());
    analytics = new Analytics({ send, batchSize: 5, flushInterval: 20 });
    analytics.track('a');
    await analytics.flush();
    await sleep(50);
    expect(send).toHaveBeenCalledTimes(1);
  });

  test('later tracks do not restart the timer', async () => {
    const send = jest.fn(() => Promise.resolve());
    analytics = new Analytics({ send, batchSize: 10, flushInterval: 40 });
    analytics.track('a');
    await sleep(25);
    analytics.track('b');
    await sleep(35);
    expect(send).toHaveBeenCalledTimes(1);
    expect(names(send.mock.calls[0][0])).toEqual(['a', 'b']);
  });

  test('a failed batch goes back to the front and is retried in order on the next flush', async () => {
    const send = jest.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined);
    analytics = new Analytics({ send, batchSize: 10, flushInterval: 1000 });
    analytics.track('a');
    analytics.track('b');
    await expect(analytics.flush()).resolves.toBe(false);
    analytics.track('c');
    await expect(analytics.flush()).resolves.toBe(true);
    expect(send).toHaveBeenCalledTimes(2);
    expect(names(send.mock.calls[1][0])).toEqual(['a', 'b', 'c']);
  });

  test('events tracked while a failing send is in flight stay behind the failed batch', async () => {
    let rejectFirst;
    const send = jest
      .fn()
      .mockImplementationOnce(() => new Promise((_, reject) => (rejectFirst = reject)))
      .mockResolvedValue(undefined);
    analytics = new Analytics({ send, batchSize: 2, flushInterval: 1000 });
    analytics.track('a');
    analytics.track('b'); // triggers a flush that is now in flight
    await sleep(0);
    analytics.track('c');
    rejectFirst(new Error('offline'));
    await sleep(0);
    await analytics.flush();
    const sent = send.mock.calls.slice(1).flatMap(([batch]) => names(batch));
    expect(sent).toEqual(['a', 'b', 'c']);
  });

  test('a synchronous throw from send counts as a failure', async () => {
    const send = jest.fn(() => {
      throw new Error('bad');
    });
    analytics = new Analytics({ send, batchSize: 10 });
    analytics.track('a');
    await expect(analytics.flush()).resolves.toBe(false);
    send.mockImplementation(() => Promise.resolve());
    await expect(analytics.flush()).resolves.toBe(true);
    expect(names(send.mock.calls[1][0])).toEqual(['a']);
  });

  test('destroy clears the timer and ignores later tracks', async () => {
    const send = jest.fn(() => Promise.resolve());
    analytics = new Analytics({ send, batchSize: 5, flushInterval: 20 });
    analytics.track('a');
    analytics.destroy();
    analytics.track('b');
    await sleep(50);
    expect(send).not.toHaveBeenCalled();
    await analytics.flush();
    expect(names(send.mock.calls[0][0])).toEqual(['a']);
  });

  test('instances do not share buffers', async () => {
    const sendA = jest.fn(() => Promise.resolve());
    const sendB = jest.fn(() => Promise.resolve());
    const a = new Analytics({ send: sendA, batchSize: 5 });
    const b = new Analytics({ send: sendB, batchSize: 5 });
    a.track('only-a');
    await a.flush();
    await b.flush();
    a.destroy();
    b.destroy();
    expect(sendA).toHaveBeenCalledTimes(1);
    expect(sendB).not.toHaveBeenCalled();
  });
});
