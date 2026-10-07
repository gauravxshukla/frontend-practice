import camelCaseKeys from './solution.js';

describe('camelCaseKeys', () => {
  test('example: converts snake, kebab and nested keys', () => {
    expect(
      camelCaseKeys({ first_name: 'Ada', 'Last-Name': 'Lovelace', home_address: { zip_code: '123' } }),
    ).toEqual({ firstName: 'Ada', lastName: 'Lovelace', homeAddress: { zipCode: '123' } });
  });

  test('example: objects inside arrays and space-separated keys', () => {
    expect(camelCaseKeys([{ user_id: 1, 'is active': true }])).toEqual([{ userId: 1, isActive: true }]);
  });

  test('already-camelCase keys are unchanged', () => {
    expect(camelCaseKeys({ alreadyCamel: 1, a: 2, userID: 3 })).toEqual({ alreadyCamel: 1, a: 2, userID: 3 });
  });

  test('leading, trailing and repeated separators are ignored', () => {
    expect(camelCaseKeys({ __private_key: 1, 'trailing_': 2, 'multi__dash--and  space': 3 })).toEqual({
      privateKey: 1,
      trailing: 2,
      multiDashAndSpace: 3,
    });
  });

  test('only the first letter of each word changes case', () => {
    expect(camelCaseKeys({ Created_AT: 1, 'API-response': 2 })).toEqual({ createdAT: 1, aPIResponse: 2 });
  });

  test('values are untouched, including strings that look like keys', () => {
    expect(camelCaseKeys({ field_name: 'first_name', list: ['a_b', 'c-d'] })).toEqual({
      fieldName: 'first_name',
      list: ['a_b', 'c-d'],
    });
  });

  test('deeply nested arrays of objects', () => {
    expect(camelCaseKeys({ outer_list: [[{ inner_key: { deep_key: null } }]] })).toEqual({
      outerList: [[{ innerKey: { deepKey: null } }]],
    });
  });

  test('primitives and null are returned as is', () => {
    expect(camelCaseKeys('a_b')).toBe('a_b');
    expect(camelCaseKeys(42)).toBe(42);
    expect(camelCaseKeys(null)).toBeNull();
    expect(camelCaseKeys(undefined)).toBeUndefined();
  });

  test('Dates and other non-plain objects are left as is', () => {
    class Model {
      constructor() {
        this.snake_prop = 1;
      }
    }
    const date = new Date(0);
    const model = new Model();
    const map = new Map([['a_b', 1]]);
    const result = camelCaseKeys({ created_at: date, the_model: model, the_map: map });
    expect(result.createdAt).toBe(date);
    expect(result.theModel).toBe(model);
    expect(result.theModel.snake_prop).toBe(1);
    expect(result.theMap).toBe(map);
  });

  test('does not mutate the input', () => {
    const input = { a_b: { c_d: [{ e_f: 1 }] } };
    const result = camelCaseKeys(input);
    expect(input).toEqual({ a_b: { c_d: [{ e_f: 1 }] } });
    expect(result).not.toBe(input);
  });
});
