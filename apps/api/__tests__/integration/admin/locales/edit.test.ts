import type { LocaleCreationAttributes } from '@intake24/common/types/models';
import { suite } from '@intake24/api-tests/integration/helpers';
import { FoodsLocale, SystemLocale } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|edit'];

  let url: string;
  let invalidUrl: string;

  let input: LocaleCreationAttributes;
  let output: LocaleCreationAttributes;
  let systemLocale: SystemLocale;

  beforeAll(async () => {
    const { code } = suite.data.system.language;
    input = {
      code: 'en-ca',
      englishName: 'English - Canada',
      localName: 'English - Canada',
      respondentLanguageId: code,
      adminLanguageId: code,
      countryFlagCode: 'en-ca',
      prototypeLocaleId: null,
      textDirection: 'ltr',
      foodIndexLanguageBackendId: 'en',
    };

    await FoodsLocale.create({ id: input.code, ...input });
    systemLocale = await SystemLocale.create(input);

    output = { ...input };

    url = `${baseUrl}/${systemLocale.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecord('get', url, output);
    });
  });
};
