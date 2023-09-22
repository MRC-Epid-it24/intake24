import type { SystemLocaleCreationAttributes } from '@intake24/db';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/locales';
  const permissions = ['locales', 'locales|create'];

  let input: SystemLocaleCreationAttributes;
  let output: SystemLocaleCreationAttributes;

  beforeAll(async () => {
    const { code } = suite.data.system.language;
    input = {
      code: 'en-cb',
      englishName: 'English - Caribbean',
      localName: 'English - Caribbean',
      respondentLanguageId: code,
      adminLanguageId: code,
      countryFlagCode: 'en-cb',
      prototypeLocaleId: null,
      textDirection: 'ltr',
      foodIndexLanguageBackendId: 'en',
    };
    output = { ...input };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 400 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [
        'code',
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
        'post',
        url,
        [
          'code',
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
            code: null,
            englishName: [],
            localName: ['dddsds', 'dffd'],
            respondentLanguageId: 'nonLocaleString',
            adminLanguageId: 5,
            countryFlagCode: 5,
            prototypeLocaleId: 'nonExistingLocale',
            textDirection: 'wrongDirection',
          },
        }
      );
    });

    it('should return 201 and new resource', async () => {
      await suite.sharedTests.assertRecordInserted('post', url, output, { input });
    });

    it('should return 400 for duplicate id', async () => {
      const { code } = suite.data.system.language;

      await suite.sharedTests.assertInvalidInput('post', url, ['code'], {
        input: {
          code: input.code,
          englishName: 'English - India',
          localName: 'English - India',
          respondentLanguageId: code,
          adminLanguageId: code,
          countryFlagCode: 'en-in',
          prototypeLocaleId: null,
          textDirection: 'ltr',
        },
      });
    });
  });
};
