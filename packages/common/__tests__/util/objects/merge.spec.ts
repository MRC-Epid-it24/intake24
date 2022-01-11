import { merge } from '@intake24/common/util';

describe('merge', () => {
  /*
   * Only testing the behavior of array merge
   * -> source array should be copied
   */
  it('it should merge with copied source array', () => {
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

    const merged = merge(one, two);

    expect(merged).toEqual({
      a: 2,
      b: [6, 7, 8, 9, 10],
      c: 3,
      d: 4,
    });
  });
});
