import { conditionOps } from './conditions';

describe('conditionOps', () => {
  test('equal', () => {
    expect(conditionOps.eq({ value: 1, answer: 1 })).toBe(true);
    expect(conditionOps.eq({ value: 'one', answer: 'one' })).toBe(true);
    expect(conditionOps.eq({ value: [1], answer: 1 })).toBe(true);
    expect(conditionOps.eq({ value: 1, answer: [1] })).toBe(true);
    expect(conditionOps.eq({ value: '1', answer: [1] })).toBe(true);
    expect(conditionOps.eq({ value: ['1'], answer: [1] })).toBe(true);
    expect(conditionOps.eq({ value: [1, 2], answer: [1, '2'] })).toBe(true);
    expect(conditionOps.eq({ value: [' one', 'two'], answer: ['One', 'two '] })).toBe(true);
  });

  test('not equal', () => {
    expect(conditionOps.ne({ value: 'one', answer: 'two' })).toBe(true);
    expect(conditionOps.ne({ value: [' one', 'two'], answer: ['One', 'two '] })).toBe(false);
  });

  test('is in', () => {
    expect(conditionOps.in({ value: 'one', answer: 'one' })).toBe(true);
    expect(conditionOps.in({ value: 'one', answer: 'two' })).toBe(false);
    expect(conditionOps.in({ value: ['One ', '  Two'], answer: 'one' })).toBe(true);
    expect(conditionOps.in({ value: ['One ', '  Two'], answer: ['one'] })).toBe(true);
    expect(conditionOps.in({ value: ['One ', '  Two'], answer: ['one', 'two'] })).toBe(true);
    expect(conditionOps.in({ value: ['One ', '  Two'], answer: [] })).toBe(false);
  });

  test('is not in', () => {
    expect(conditionOps.notIn({ value: 'one', answer: 'two' })).toBe(true);
    expect(conditionOps.notIn({ value: 'one', answer: 'one' })).toBe(false);
    expect(conditionOps.notIn({ value: ['One '], answer: 'two' })).toBe(true);
    expect(conditionOps.notIn({ value: ['One '], answer: 'one' })).toBe(false);
    expect(conditionOps.notIn({ value: ['One '], answer: ['two'] })).toBe(true);
    expect(conditionOps.notIn({ value: ['One '], answer: ['one'] })).toBe(false);
    expect(conditionOps.notIn({ value: ['One ', 'Two '], answer: ['two', 'three'] })).toBe(false);
    expect(conditionOps.notIn({ value: ['One ', 'Two '], answer: ['three', 'four'] })).toBe(true);
    expect(conditionOps.notIn({ value: [], answer: ['three', 'four'] })).toBe(true);
    expect(conditionOps.notIn({ value: ['One ', 'Two '], answer: [] })).toBe(true);
  });

  test('greater than equal ', () => {
    expect(conditionOps.gte({ value: 1, answer: 1 })).toBe(true);
    expect(conditionOps.gte({ value: 1, answer: 2 })).toBe(true);
    expect(conditionOps.gte({ value: 1, answer: 0 })).toBe(false);
    expect(conditionOps.gte({ value: '1', answer: '2' })).toBe(true);
    expect(conditionOps.gte({ value: ['1'], answer: ['2'] })).toBe(true);
    expect(conditionOps.gte({ value: '1', answer: 'one' })).toBe(false);
    expect(conditionOps.gte({ value: 'two', answer: '3' })).toBe(false);
  });

  test('greater than', () => {
    expect(conditionOps.gt({ value: 1, answer: 1 })).toBe(false);
    expect(conditionOps.gt({ value: 1, answer: 2 })).toBe(true);
    expect(conditionOps.gt({ value: 1, answer: 0 })).toBe(false);
    expect(conditionOps.gt({ value: '1', answer: '2' })).toBe(true);
    expect(conditionOps.gt({ value: ['1'], answer: ['2'] })).toBe(true);
    expect(conditionOps.gt({ value: '1', answer: 'one' })).toBe(false);
  });

  test('lower than equal ', () => {
    expect(conditionOps.lte({ value: 1, answer: 1 })).toBe(true);
    expect(conditionOps.lte({ value: 2, answer: 1 })).toBe(true);
    expect(conditionOps.lte({ value: 0, answer: 1 })).toBe(false);
    expect(conditionOps.lte({ value: '2', answer: '1' })).toBe(true);
    expect(conditionOps.lte({ value: ['2'], answer: ['1'] })).toBe(true);
    expect(conditionOps.lte({ value: 'one', answer: '1' })).toBe(false);
    expect(conditionOps.lte({ value: '3', answer: 'two' })).toBe(false);
  });

  test('lower than', () => {
    expect(conditionOps.lt({ value: 1, answer: 1 })).toBe(false);
    expect(conditionOps.lt({ value: 2, answer: 1 })).toBe(true);
    expect(conditionOps.lt({ value: 0, answer: 1 })).toBe(false);
    expect(conditionOps.lt({ value: '2', answer: '1' })).toBe(true);
    expect(conditionOps.lt({ value: ['2'], answer: ['1'] })).toBe(true);
    expect(conditionOps.lt({ value: '1', answer: 'one' })).toBe(false);
  });
});
