// binary heap: before(a, b) is true when a should come out first
class Heap {
  constructor(before) {
    this.before = before;
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  peek() {
    return this.items[0];
  }

  push(value) {
    const a = this.items;
    a.push(value);
    // sift up: swap with the parent while the new item should come out sooner
    let i = a.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.before(a[i], a[parent])) break;
      [a[i], a[parent]] = [a[parent], a[i]];
      i = parent;
    }
  }

  pop() {
    const a = this.items;
    const top = a[0];
    const last = a.pop();
    if (a.length) {
      a[0] = last;
      // sift down: swap with whichever child should come out first
      let i = 0;
      while (true) {
        const l = 2 * i + 1;
        const r = l + 1;
        let first = i;
        if (l < a.length && this.before(a[l], a[first])) first = l;
        if (r < a.length && this.before(a[r], a[first])) first = r;
        if (first === i) break;
        [a[i], a[first]] = [a[first], a[i]];
        i = first;
      }
    }
    return top;
  }
}

export default class Twitter {
  constructor() {
    this.time = 0; // global clock: a higher time means a newer tweet
    this.tweets = new Map(); // userId -> [time, tweetId][] in posting order
    this.following = new Map(); // userId -> Set of followee ids
  }

  /**
   * @param {number} userId
   * @param {number} tweetId
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
    // a user's own tweets are always in their feed
    const users = new Set(this.following.get(userId) ?? []);
    users.add(userId);
    // max-heap of [time, tweetId, user, index]: each user's newest unread tweet
    const heap = new Heap((a, b) => a[0] > b[0]);
    for (const u of users) {
      const list = this.tweets.get(u) ?? [];
      if (list.length) {
        const i = list.length - 1;
        heap.push([list[i][0], list[i][1], u, i]);
      }
    }
    const feed = [];
    while (heap.size && feed.length < 10) {
      const [, tweetId, u, i] = heap.pop();
      feed.push(tweetId);
      // that user's previous tweet is now their newest unread one
      if (i > 0) {
        const [t, id] = this.tweets.get(u)[i - 1];
        heap.push([t, id, u, i - 1]);
      }
    }
    return feed;
  }

  /**
   * @param {number} followerId
   * @param {number} followeeId
   */
  follow(followerId, followeeId) {
    if (!this.following.has(followerId)) this.following.set(followerId, new Set());
    this.following.get(followerId).add(followeeId);
  }

  /**
   * @param {number} followerId
   * @param {number} followeeId
   */
  unfollow(followerId, followeeId) {
    this.following.get(followerId)?.delete(followeeId);
  }
}
