import type { LanguageCreationAttributes } from '@intake24/common/types/models';
import { suite } from '@intake24/api-tests/integration/helpers';
import { Language } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/languages';
  const permissions = ['languages', 'languages|read'];

  let url: string;
  let invalidUrl: string;

  let input: LanguageCreationAttributes;
  let output: LanguageCreationAttributes;
  let language: Language;

  beforeAll(async () => {
    input = {
      id: 'es-cl',
      englishName: 'Spanish - Chile',
      localName: 'Spanish - Chile',
      countryFlagCode: 'es-cl',
      textDirection: 'ltr',
    };
    language = await Language.create(input);
    output = { ...input };

    url = `${baseUrl}/${language.id}`;
    invalidUrl = `${baseUrl}/999999`;
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
