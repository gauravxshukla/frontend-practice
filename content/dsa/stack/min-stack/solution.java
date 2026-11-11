class MinStack {
    // each entry is {value, smallest value at or below this height}
    private final Deque<int[]> stack = new ArrayDeque<>();

    public MinStack() {}

    public void push(int val) {
        // the new minimum is the smaller of val and the minimum beneath it
        int min = stack.isEmpty() ? val : Math.min(val, getMin());
        stack.push(new int[] {val, min});
    }

    public void pop() {
        // the pair below already holds the previous minimum, so nothing to recompute
        stack.pop();
    }

    public int top() {
        return stack.peek()[0];
    }

    public int getMin() {
        return stack.peek()[1];
    }
}
