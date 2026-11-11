class Solution {
    public int evalRPN(String[] tokens) {
        Set<String> ops = Set.of("+", "-", "*", "/");
        Deque<Integer> stack = new ArrayDeque<>(); // operands waiting for an operator
        for (String token : tokens) {
            if (!ops.contains(token)) {
                stack.push(Integer.parseInt(token));
                continue;
            }
            // the right operand is on top, so pop it first
            int b = stack.pop();
            int a = stack.pop();
            if (token.equals("+")) stack.push(a + b);
            else if (token.equals("-")) stack.push(a - b);
            else if (token.equals("*")) stack.push(a * b);
            // integer division truncates toward zero, as Java's / already does
            else stack.push(a / b);
        }
        return stack.pop();
    }
}
