import { arrayToObject } from '@intake24/common/util';

describe('arrayToObject', () => {
  it('should convert array to object by defined key', () => {
    const input = [
      { id: '1', a: 'aa', b: 'bb' },
      { id: '2', a: 'aaa', b: 'bbb' },
      { id: '3', a: 'aaaa', b: 'bbbb' },
    ];

    const output = {
      '1': { id: '1', a: 'aa', b: 'bb' },
      '2': { id: '2', a: 'aaa', b: 'bbb' },
      '3': { id: '3', a: 'aaaa', b: 'bbbb' },
    };

    expect(arrayToObject(input, 'id')).toEqual(output);
  });
});
