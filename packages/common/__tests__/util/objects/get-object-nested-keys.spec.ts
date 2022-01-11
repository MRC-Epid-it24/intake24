import { getObjectNestedKeys } from '@intake24/common/util';

describe('getObjectNestedKeys', () => {
  it('it should get deeply extract all keys with dotted syntax', () => {
    const obj = {
      a: 1,
      b: 2,
      c: {
        a: 1,
        b: 2,
        c: { a: 1, b: 2 },
      },
    };

    const keys = getObjectNestedKeys(obj);

    expect(keys).toEqual(['a', 'b', 'c.a', 'c.b', 'c.c.a', 'c.c.b']);
  });
});
