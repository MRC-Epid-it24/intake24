import { randomString } from '@intake24/common/util';

describe('randomString', () => {
  it('should produce string of defined length', () => {
    expect(randomString(10)).toHaveLength(10);
  });

  it('should produce string of defined alphabet', () => {
    const token = randomString(5, 'a');

    expect(token).toHaveLength(5);
    expect(token).toEqual('aaaaa');
  });
});
