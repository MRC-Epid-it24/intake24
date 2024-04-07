import type { SystemLocaleCreationAttributes } from '@intake24/db';
import { suite } from '@intake24/api-tests/integration/helpers';
import { FoodsLocale, SystemLocale } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|edit'];

  let url: string;
  let invalidUrl: string;

  let input: SystemLocaleCreationAttributes;
  let output: SystemLocaleCreationAttributes;
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
      foodIndexEnabled: true,
      foodIndexLanguageBackendId: 'en',
      visibility: 'public',
    };

    await FoodsLocale.create({ id: input.code, ...input });
    systemLocale = await SystemLocale.create(input);

    output = { ...input };

    url = `${baseUrl}/${systemLocale.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  it('missing authentication / authorization', async () => {
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
