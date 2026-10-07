import TaskQueue from './solution.js';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const wait = (ms, value) => () => sleep(ms).then(() => value);

describe('TaskQueue', () => {
  test('example: each add() resolves with its own task result', async () => {
    const queue = new TaskQueue(2);
    const results = await Promise.all([queue.add(wait(30, 'a')), queue.add(wait(10, 'b')), queue.add(wait(10, 'c'))]);
    expect(results).toEqual(['a', 'b', 'c']);
  });

  test('example: running and pending reflect the concurrency limit', async () => {
    const queue = new TaskQueue(2);
    queue.add(wait(30, 'a'));
    queue.add(wait(10, 'b'));
    queue.add(wait(10, 'c'));
    expect(queue.running).toBe(2);
    expect(queue.pending).toBe(1);
    await queue.onIdle();
    expect(queue.running).toBe(0);
    expect(queue.pending).toBe(0);
  });

  test('never runs more than concurrency tasks at once', async () => {
    const queue = new TaskQueue(3);
    let inFlight = 0;
    let max = 0;
    const task = async () => {
      inFlight += 1;
      max = Math.max(max, inFlight);
      await sleep(10);
      inFlight -= 1;
    };
    for (let i = 0; i < 8; i++) queue.add(task);
    await queue.onIdle();
    expect(max).toBe(3);
  });

  test('starts waiting tasks in FIFO order', async () => {
    const queue = new TaskQueue(1);
    const started = [];
    const task = (name) => async () => {
      started.push(name);
      await sleep(5);
    };
    queue.add(task('a'));
    queue.add(task('b'));
    queue.add(task('c'));
    await queue.onIdle();
    expect(started).toEqual(['a', 'b', 'c']);
  });

  test('a failing task rejects its own promise and the queue keeps going', async () => {
    const queue = new TaskQueue(1);
    const failing = queue.add(() => Promise.reject(new Error('task failed')));
    const next = queue.add(wait(5, 'still runs'));
    await expect(failing).rejects.toThrow('task failed');
    await expect(next).resolves.toBe('still runs');
  });

  test('a task that throws synchronously only rejects its own promise', async () => {
    const queue = new TaskQueue(1);
    const bad = queue.add(() => {
      throw new Error('sync throw');
    });
    const good = queue.add(() => 'fine');
    await expect(bad).rejects.toThrow('sync throw');
    await expect(good).resolves.toBe('fine');
  });

  test('starts the next task as soon as a slot frees up', async () => {
    const queue = new TaskQueue(2);
    const t0 = Date.now();
    let startedAt;
    queue.add(wait(80));
    queue.add(wait(10));
    queue.add(async () => {
      startedAt = Date.now() - t0;
    });
    await queue.onIdle();
    expect(startedAt).toBeLessThan(50);
  });

  test('onIdle resolves immediately when the queue is empty', async () => {
    const queue = new TaskQueue(2);
    let idle = false;
    queue.onIdle().then(() => {
      idle = true;
    });
    await sleep(0);
    expect(idle).toBe(true);
  });

  test('onIdle waits for every task, including failing ones', async () => {
    const queue = new TaskQueue(2);
    const done = [];
    queue.add(() => sleep(20).then(() => done.push('slow')));
    queue.add(() => Promise.reject(new Error('x'))).catch(() => done.push('failed'));
    queue.add(() => sleep(5).then(() => done.push('fast')));
    await queue.onIdle();
    expect(done).toHaveLength(3);
    expect(queue.running).toBe(0);
  });

  test('calls each task exactly once', async () => {
    const queue = new TaskQueue(2);
    const task = jest.fn(() => Promise.resolve('once'));
    await queue.add(task);
    expect(task).toHaveBeenCalledTimes(1);
  });

  test('keeps working after it has gone idle', async () => {
    const queue = new TaskQueue(1);
    await queue.add(wait(5, 1));
    await queue.onIdle();
    await expect(queue.add(wait(5, 2))).resolves.toBe(2);
  });

  test('separate queues are independent', async () => {
    const a = new TaskQueue(1);
    const b = new TaskQueue(1);
    a.add(wait(20));
    b.add(wait(20));
    expect(a.running).toBe(1);
    expect(b.running).toBe(1);
    expect(a.pending).toBe(0);
    await Promise.all([a.onIdle(), b.onIdle()]);
  });
});
