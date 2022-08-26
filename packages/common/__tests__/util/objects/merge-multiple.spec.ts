import { mergeMultiple } from '@intake24/common/util';

describe('merge multiple objects', () => {
  it('it should merge multiple objects', () => {
    const one = {
      a: 1,
      b: [1, 2, 3, 4, 5],
      c: 3,
    };
    const two = {
      a: 2,
      b: [6, 7, 8, 9, 10],
      d: 4,
    };
    const three = {
      a: 3,
      d: 5,
      e: 6,
    };

    const merged = mergeMultiple(one, two, three);

    expect(merged).toEqual({
      a: 3,
      b: [6, 7, 8, 9, 10],
      c: 3,
      d: 5,
      e: 6,
    });
  });
});
