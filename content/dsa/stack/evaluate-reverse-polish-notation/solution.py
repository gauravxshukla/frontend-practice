class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []  # operands waiting for an operator
        for token in tokens:
            if token not in ("+", "-", "*", "/"):
                stack.append(int(token))
                continue
            # the right operand is on top, so pop it first
            b = stack.pop()
            a = stack.pop()
            if token == "+":
                stack.append(a + b)
            elif token == "-":
                stack.append(a - b)
            elif token == "*":
                stack.append(a * b)
            else:
                # integer division truncates toward zero, not down (// would floor)
                stack.append(int(a / b))
        return stack.pop()
