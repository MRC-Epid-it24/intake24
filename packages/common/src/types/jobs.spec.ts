import { pickJobParams } from '@intake24/common/types/jobs';

describe('pickJobParams', () => {
  it('should pick correct job parameters', () => {
    const params = pickJobParams(
      { a: 1, b: 2, c: 3, sourceLocaleId: 'locale1', localeId: 'locale2' },
      'LocalePopularitySearchCopy'
    );
    expect(params).toStrictEqual({ sourceLocaleId: 'locale1', localeId: 'locale2' });
  });
});
