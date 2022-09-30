import type { LocaleAttributes } from '@intake24/common/types/models';
import { suite } from '@intake24/api-tests/integration/helpers';
import { FoodsLocale, SystemLocale } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|edit'];

  let url: string;
  let invalidUrl: string;

  let input: LocaleAttributes;
  let updateInput: LocaleAttributes;
  let output: LocaleAttributes;
  let systemLocale: SystemLocale;

  beforeAll(async () => {
    const { id: langId } = suite.data.system.language;
    input = {
      id: 'en-ie',
      englishName: 'English - Ireland',
      localName: 'English - Ireland',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-ie',
      prototypeLocaleId: null,
      textDirection: 'ltr',
      foodIndexLanguageBackendId: 'en',
    };
    updateInput = {
      id: 'en-jm',
      englishName: 'English - Jamaica',
      localName: 'English - Jamaica',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-jm',
      prototypeLocaleId: null,
      textDirection: 'ltr',
      foodIndexLanguageBackendId: 'en',
    };

    const { id } = input;
    output = { ...updateInput, id };

    await FoodsLocale.create(input);
    systemLocale = await SystemLocale.create(input);

    url = `${baseUrl}/${systemLocale.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, [
        'englishName',
        'localName',
        'respondentLanguageId',
        'adminLanguageId',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
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
        ],
        {
          input: {
            englishName: { name: 'United Kingdom' },
            localName: ['United Kingdom'],
            respondentLanguageId: 10,
            adminLanguageId: 'nonLocaleString',
            countryFlagCode: false,
            prototypeLocaleId: 'nonExistingLocale',
            textDirection: 'wrongDirection',
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
