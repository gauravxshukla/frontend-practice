class Twitter {
    private int time = 0; // global clock: a higher time means a newer tweet
    private final Map<Integer, List<int[]>> tweets = new HashMap<>(); // userId -> {time, tweetId} in posting order
    private final Map<Integer, Set<Integer>> following = new HashMap<>(); // userId -> followee ids

    public Twitter() {}

    public void postTweet(int userId, int tweetId) {
        tweets.computeIfAbsent(userId, k -> new ArrayList<>()).add(new int[] {time++, tweetId});
    }

    public List<Integer> getNewsFeed(int userId) {
        // a user's own tweets are always in their feed
        Set<Integer> users = new HashSet<>(following.getOrDefault(userId, Collections.emptySet()));
        users.add(userId);
        // max-heap of {time, tweetId, user, index}: each user's newest unread tweet
        PriorityQueue<int[]> heap = new PriorityQueue<>((a, b) -> Integer.compare(b[0], a[0]));
        for (int u : users) {
            List<int[]> list = tweets.getOrDefault(u, Collections.emptyList());
            if (!list.isEmpty()) {
                int i = list.size() - 1;
                heap.offer(new int[] {list.get(i)[0], list.get(i)[1], u, i});
            }
        }
        List<Integer> feed = new ArrayList<>();
        while (!heap.isEmpty() && feed.size() < 10) {
            int[] top = heap.poll();
            feed.add(top[1]);
            // that user's previous tweet is now their newest unread one
            int i = top[3];
            if (i > 0) {
                int[] prev = tweets.get(top[2]).get(i - 1);
                heap.offer(new int[] {prev[0], prev[1], top[2], i - 1});
            }
        }
        return feed;
    }

    public void follow(int followerId, int followeeId) {
        following.computeIfAbsent(followerId, k -> new HashSet<>()).add(followeeId);
    }

    public void unfollow(int followerId, int followeeId) {
        Set<Integer> set = following.get(followerId);
        if (set != null) set.remove(followeeId);
    }
}
