import { subtractTime } from '@intake24/api/util';

describe('subtractTime', () => {
  it('should subtract time in milliseconds', () => {
    const now = new Date();
    expect(subtractTime(1000, now).getTime()).toEqual(now.getTime() - 1000);
  });

  it(`should subtract time as 'ms' string`, () => {
    const now = new Date();
    expect(subtractTime('1m', now).getTime()).toEqual(now.getTime() - 60 * 1000);
    expect(subtractTime('1h', now).getTime()).toEqual(now.getTime() - 60 * 60 * 1000);
  });

  it(`should run without 'since' argument`, () => {
    expect(subtractTime('1m')).toBeValidDate();
  });
});
