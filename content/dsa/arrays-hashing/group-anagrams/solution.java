class Solution {
    public List<List<String>> groupAnagrams(String[] strs) {
        Map<String, List<String>> groups = new HashMap<>(); // signature -> words with that signature
        for (String word : strs) {
            // anagrams have identical letter counts, so the counts identify the group
            int[] counts = new int[26];
            for (int i = 0; i < word.length(); i++) counts[word.charAt(i) - 'a']++;
            // the separator keeps counts like [1, 11] and [11, 1] from colliding
            StringBuilder key = new StringBuilder();
            for (int c : counts) key.append(c).append('#');
            groups.computeIfAbsent(key.toString(), k -> new ArrayList<>()).add(word);
        }
        return new ArrayList<>(groups.values());
    }
}
