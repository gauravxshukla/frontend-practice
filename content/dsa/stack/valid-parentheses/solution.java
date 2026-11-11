class Solution {
    public boolean isValid(String s) {
        Map<Character, Character> pairs = Map.of(')', '(', ']', '[', '}', '{'); // closer -> the opener it needs
        Deque<Character> stack = new ArrayDeque<>(); // openers still waiting to be closed
        for (char ch : s.toCharArray()) {
            if (!pairs.containsKey(ch)) {
                stack.push(ch);
            } else if (stack.isEmpty() || !stack.pop().equals(pairs.get(ch))) {
                // the latest unclosed opener must match (an empty stack fails too)
                return false;
            }
        }
        // anything left was opened but never closed
        return stack.isEmpty();
    }
}
