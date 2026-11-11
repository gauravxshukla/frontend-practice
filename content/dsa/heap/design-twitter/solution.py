class Twitter:
    def __init__(self):
        self.time = 0  # global clock: a higher time means a newer tweet
        self.tweets = {}  # userId -> [(time, tweetId)] in posting order
        self.following = {}  # userId -> set of followee ids

    def postTweet(self, userId: int, tweetId: int) -> None:
        self.tweets.setdefault(userId, []).append((self.time, tweetId))
        self.time += 1

    def getNewsFeed(self, userId: int) -> List[int]:
        # a user's own tweets are always in their feed
        users = set(self.following.get(userId, set()))
        users.add(userId)
        # max-heap (negated time) of each user's newest unread tweet: (-time, tweetId, user, index)
        heap = []
        for u in users:
            lst = self.tweets.get(u, [])
            if lst:
                i = len(lst) - 1
                heappush(heap, (-lst[i][0], lst[i][1], u, i))
        feed = []
        while heap and len(feed) < 10:
            _, tweet_id, u, i = heappop(heap)
            feed.append(tweet_id)
            # that user's previous tweet is now their newest unread one
            if i > 0:
                t, tid = self.tweets[u][i - 1]
                heappush(heap, (-t, tid, u, i - 1))
        return feed

    def follow(self, followerId: int, followeeId: int) -> None:
        self.following.setdefault(followerId, set()).add(followeeId)

    def unfollow(self, followerId: int, followeeId: int) -> None:
        self.following.get(followerId, set()).discard(followeeId)
