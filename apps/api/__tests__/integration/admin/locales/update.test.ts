import type { SystemLocaleCreationAttributes } from '@intake24/db';
import { suite } from '@intake24/api-tests/integration/helpers';
import { FoodsLocale, SystemLocale } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|edit'];

  let url: string;
  let invalidUrl: string;

  let input: SystemLocaleCreationAttributes;
  let updateInput: SystemLocaleCreationAttributes;
  let output: SystemLocaleCreationAttributes;
  let systemLocale: SystemLocale;

  beforeAll(async () => {
    const { code: langCode } = suite.data.system.language;
    input = {
      code: 'en-ie',
      englishName: 'English - Ireland',
      localName: 'English - Ireland',
      respondentLanguageId: langCode,
      adminLanguageId: langCode,
      countryFlagCode: 'en-ie',
      prototypeLocaleId: null,
      textDirection: 'ltr',
      foodIndexEnabled: true,
      foodIndexLanguageBackendId: 'en',
    };
    updateInput = {
      code: 'en-jm',
      englishName: 'English - Jamaica',
      localName: 'English - Jamaica',
      respondentLanguageId: langCode,
      adminLanguageId: langCode,
      countryFlagCode: 'en-jm',
      prototypeLocaleId: null,
      textDirection: 'ltr',
      foodIndexEnabled: false,
      foodIndexLanguageBackendId: 'en',
    };

    const { code } = input;
    output = { ...updateInput, code };

    await FoodsLocale.create({ id: input.code, ...input });
    systemLocale = await SystemLocale.create(input);

    url = `${baseUrl}/${systemLocale.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { input: updateInput, permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 400 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, [
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it('should return 400 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput(
        'put',
        url,
        [
          'englishName',
          'localName',
          'respondentLanguageId',
          'adminLanguageId',
          'countryFlagCode',
          'prototypeLocaleId',
          'textDirection',
          'foodIndexEnabled',
          'foodIndexLanguageBackendId',
        ],
        {
          input: {
            englishName: { name: 'United Kingdom' },
            localName: ['United Kingdom'],
            respondentLanguageId: 10,
            adminLanguageId: 'nonLocaleString',
            countryFlagCode: 'notWellFormedLocale',
            prototypeLocaleId: 'nonExistingLocale',
            textDirection: 'wrongDirection',
            foodIndexEnabled: 123456,
            foodIndexLanguageBackendId: 'nonExistingLocale',
          },
        }
      );
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('put', invalidUrl, { input: updateInput });
    });

    it('should return 200 and data', async () => {
      await suite.sharedTests.assertRecordUpdated('put', url, output, { input: updateInput });
    });
  });
};
