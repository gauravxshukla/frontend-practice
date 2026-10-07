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

export default class Twitter {
  constructor() {
    this.time = 0; // global counter so tweets can be ordered across users
    this.tweets = new Map(); // userId -> [[time, tweetId], ...] oldest first
    this.following = new Map(); // userId -> Set of followee ids
  }

  /**
   * @param {number} userId
   * @param {number} tweetId
   * @return {void}
   */
  postTweet(userId, tweetId) {
    if (!this.tweets.has(userId)) this.tweets.set(userId, []);
    this.tweets.get(userId).push([this.time++, tweetId]);
  }

  /**
   * @param {number} userId
   * @return {number[]} up to 10 tweet ids, newest first
   */
  getNewsFeed(userId) {
    const sources = new Set(this.following.get(userId) ?? []);
    sources.add(userId);

    // Max-heap by time over each source's newest unread tweet: a k-way merge.
    const heap = new Heap((a, b) => a.time > b.time);
    for (const id of sources) {
      const list = this.tweets.get(id);
      if (list && list.length) {
        const i = list.length - 1;
        heap.push({ time: list[i][0], tweetId: list[i][1], list, i });
      }
    }

    const feed = [];
    while (heap.size && feed.length < 10) {
      const { tweetId, list, i } = heap.pop();
      feed.push(tweetId);
      if (i > 0) heap.push({ time: list[i - 1][0], tweetId: list[i - 1][1], list, i: i - 1 });
    }
    return feed;
  }

  /**
   * @param {number} followerId
   * @param {number} followeeId
   * @return {void}
   */
  follow(followerId, followeeId) {
    if (followerId === followeeId) return;
    if (!this.following.has(followerId)) this.following.set(followerId, new Set());
    this.following.get(followerId).add(followeeId);
  }

  /**
   * @param {number} followerId
   * @param {number} followeeId
   * @return {void}
   */
  unfollow(followerId, followeeId) {
    this.following.get(followerId)?.delete(followeeId);
  }
}
