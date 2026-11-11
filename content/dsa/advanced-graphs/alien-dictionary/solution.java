class Solution {
    public String alienOrder(String[] words) {
        // every letter that appears must be in the answer, even with no rules
        Map<Character, Set<Character>> after = new HashMap<>(); // letter -> letters that must come after it
        Map<Character, Integer> needs = new HashMap<>(); // letter -> how many letters must come before it
        for (String w : words) {
            for (char ch : w.toCharArray()) {
                after.putIfAbsent(ch, new HashSet<>());
                needs.putIfAbsent(ch, 0);
            }
        }
        for (int i = 0; i + 1 < words.length; i++) {
            String a = words[i];
            String b = words[i + 1];
            // a longer word before its own prefix can't be sorted by any order
            if (a.length() > b.length() && a.startsWith(b)) return "";
            // only the first differing letter tells us anything
            for (int j = 0; j < Math.min(a.length(), b.length()); j++) {
                if (a.charAt(j) != b.charAt(j)) {
                    if (after.get(a.charAt(j)).add(b.charAt(j))) needs.merge(b.charAt(j), 1, Integer::sum);
                    break;
                }
            }
        }
        // Kahn's topological sort: emit letters once nothing must precede them
        Deque<Character> ready = new ArrayDeque<>();
        for (Map.Entry<Character, Integer> e : needs.entrySet()) if (e.getValue() == 0) ready.push(e.getKey());
        StringBuilder order = new StringBuilder();
        while (!ready.isEmpty()) {
            char ch = ready.pop();
            order.append(ch);
            for (char next : after.get(ch)) {
                needs.merge(next, -1, Integer::sum);
                if (needs.get(next) == 0) ready.push(next);
            }
        }
        // letters left out are on a cycle of contradictory rules
        return order.length() == after.size() ? order.toString() : "";
    }
}
