import { cron } from '@intake24/api/http/rules';

describe('cron rule', () => {
  it('should return true for valid cron', () => {
    expect(cron('* * * * *')).toBeTrue();
  });

  it('should return true for valid cron', () => {
    expect(cron('this is not a cron entry')).toBeFalse();
  });
});
