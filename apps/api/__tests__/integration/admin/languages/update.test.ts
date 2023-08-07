import type { LanguageCreationAttributes } from '@intake24/db';
import { suite } from '@intake24/api-tests/integration/helpers';
import { Language } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/languages';
  const permissions = ['languages', 'languages|edit'];

  let url: string;
  let invalidUrl: string;

  let input: LanguageCreationAttributes;
  let updateInput: LanguageCreationAttributes;
  let output: LanguageCreationAttributes;
  let language: Language;

  beforeAll(async () => {
    input = {
      code: 'es-ec',
      englishName: 'Spanish - Ecuador',
      localName: 'Spanish - Ecuador',
      countryFlagCode: 'es-ec',
      textDirection: 'ltr',
    };
    updateInput = {
      code: 'es-sv',
      englishName: 'Spanish - El Salvador',
      localName: 'Spanish - El Salvador',
      countryFlagCode: 'es-sv',
      textDirection: 'ltr',
    };

    const { code } = input;
    output = { ...updateInput, code };

    language = await Language.create(input);

    url = `${baseUrl}/${language.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { input, permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, [
        'englishName',
        'localName',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput(
        'put',
        url,
        ['englishName', 'localName', 'countryFlagCode', 'textDirection'],
        {
          input: {
            englishName: { name: 'United Kingdom' },
            localName: ['United Kingdom'],
            countryFlagCode: 'notWellFormedLocale',
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
