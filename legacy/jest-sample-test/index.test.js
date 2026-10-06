const { add, subtract, multiply, divide } = require('../index');

describe('Math Operations', () => {
  describe('add', () => {
    test('should add two positive numbers correctly', () => {
      expect(add(2, 3)).toBe(5);
    });

    test('should add negative numbers correctly', () => {
      expect(add(-1, -2)).toBe(-3);
    });

    test('should add zero correctly', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('subtract', () => {
    test('should subtract two positive numbers correctly', () => {
      expect(subtract(5, 3)).toBe(2);
    });

    test('should handle negative results', () => {
      expect(subtract(2, 5)).toBe(-3);
    });
  });

  describe('multiply', () => {
    test('should multiply two positive numbers correctly', () => {
      expect(multiply(4, 3)).toBe(12);
    });

    test('should handle zero multiplication', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    test('should divide two positive numbers correctly', () => {
      expect(divide(10, 2)).toBe(5);
    });

    test('should handle decimal results', () => {
      expect(divide(5, 2)).toBe(2.5);
    });

    test('should throw error when dividing by zero', () => {
      expect(() => divide(5, 0)).toThrow('Division by zero is not allowed');
    });
  });
});