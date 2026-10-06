import deepClone from './solution.js';

describe('deepClone', () => {
  test('primitives and null', () => {
    expect(deepClone(1)).toBe(1);
    expect(deepClone('a')).toBe('a');
    expect(deepClone(null)).toBe(null);
    expect(deepClone(undefined)).toBe(undefined);
  });

  test('copies nested objects and arrays', () => {
    const obj = { user: { roles: ['admin'], meta: null }, list: [{ id: 1 }] };
    const copy = deepClone(obj);
    expect(copy).toEqual(obj);
    expect(copy).not.toBe(obj);
    expect(copy.user).not.toBe(obj.user);
    expect(copy.user.roles).not.toBe(obj.user.roles);
    expect(copy.list[0]).not.toBe(obj.list[0]);
  });

  test('mutating the copy leaves the original alone', () => {
    const obj = { user: { roles: ['admin'] } };
    const copy = deepClone(obj);
    copy.user.roles.push('editor');
    expect(obj.user.roles).toEqual(['admin']);
  });
});
