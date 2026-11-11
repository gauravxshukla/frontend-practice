class Solution {
    public int ladderLength(String beginWord, String endWord, String[] wordList) {
        Set<String> unused = new HashSet<>(Arrays.asList(wordList)); // dictionary words not reached yet
        if (!unused.contains(endWord)) return 0;
        List<String> level = new ArrayList<>();
        level.add(beginWord);
        int length = 1; // beginWord counts as the first word
        // BFS: every word in round k is k changes from beginWord, so the first hit is shortest
        while (!level.isEmpty()) {
            List<String> next = new ArrayList<>();
            for (String word : level) {
                if (word.equals(endWord)) return length;
                // neighbours differ in one position; generate them instead of comparing pairs
                char[] chars = word.toCharArray();
                for (int i = 0; i < chars.length; i++) {
                    char original = chars[i];
                    for (char ch = 'a'; ch <= 'z'; ch++) {
                        chars[i] = ch;
                        String candidate = new String(chars);
                        if (unused.remove(candidate)) next.add(candidate); // queued once is enough
                    }
                    chars[i] = original;
                }
            }
            level = next;
            length++;
        }
        return 0;
    }
}
