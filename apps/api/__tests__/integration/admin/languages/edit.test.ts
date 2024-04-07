import type { LanguageCreationAttributes } from '@intake24/db';
import { suite } from '@intake24/api-tests/integration/helpers';
import { Language } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/languages';
  const permissions = ['languages', 'languages|edit'];

  let url: string;
  let invalidUrl: string;

  let input: LanguageCreationAttributes;
  let output: LanguageCreationAttributes;
  let language: Language;

  beforeAll(async () => {
    input = {
      code: 'es-co',
      englishName: 'Spanish - Colombia',
      localName: 'Spanish - Colombia',
      countryFlagCode: 'es-co',
      textDirection: 'ltr',
      visibility: 'public',
    };
    language = await Language.create(input);
    output = { ...input };

    url = `${baseUrl}/${language.id}/edit`;
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
