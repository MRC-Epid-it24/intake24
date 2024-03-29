import { addTime } from '@intake24/api/util';

describe('addTime', () => {
  it('should add time in milliseconds', () => {
    const now = new Date();
    expect(addTime(1000, now).getTime()).toEqual(now.getTime() + 1000);
  });

  it(`should add time as 'ms' string`, () => {
    const now = new Date();
    expect(addTime('1m', now).getTime()).toEqual(now.getTime() + 60 * 1000);
    expect(addTime('1h', now).getTime()).toEqual(now.getTime() + 60 * 60 * 1000);
  });

  it(`should run without 'since' argument`, () => {
    expect(addTime('1m')).toBeValidDate();
  });
});
