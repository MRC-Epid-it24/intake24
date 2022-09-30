import request from 'supertest';

import type { LanguageCreationAttributes } from '@intake24/common/types/models';
import { suite } from '@intake24/api-tests/integration/helpers';
import { Language, SystemLocale } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/languages';
  const permissions = ['languages', 'languages|delete'];

  let url: string;
  let invalidUrl: string;

  let input: LanguageCreationAttributes;
  let language: Language;

  beforeAll(async () => {
    input = {
      id: 'es-ar',
      englishName: 'Spanish - Argentina',
      localName: 'Spanish - Argentina',
      countryFlagCode: 'es-ar',
      textDirection: 'ltr',
    };
    language = await Language.create(input);

    url = `${baseUrl}/${language.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });

    it(`should return 403 when language is assigned to locales`, async () => {
      const { id } = await Language.create({
        id: 'es-bo',
        englishName: 'Spanish - Bolivia',
        localName: 'Spanish - Bolivia',
        countryFlagCode: 'es-bo',
        textDirection: 'ltr',
      });
      await SystemLocale.create({
        id,
        englishName: 'Spanish - Bolivia',
        localName: 'Spanish - Bolivia',
        respondentLanguageId: id,
        adminLanguageId: id,
        countryFlagCode: id,
        prototypeLocaleId: null,
        textDirection: 'ltr',
        foodIndexLanguageBackendId: 'en',
      });

      const deleteUrl = `/api/admin/languages/${id}`;

      const { status } = await request(suite.app)
        .delete(deleteUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(403);
    });
  });
};
