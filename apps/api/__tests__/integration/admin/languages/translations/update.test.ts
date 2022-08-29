import request from 'supertest';

import type { LanguageTranslationAttributes } from '@intake24/common/types/models';
import type { LanguageTranslation } from '@intake24/db/models';
import ioc from '@intake24/api/ioc';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const permissions = ['languages', 'languages|translations'];

  let languageId: string;
  let url: string;
  let translations: LanguageTranslation[];
  let translation: LanguageTranslationAttributes;
  let updateTranslations: LanguageTranslationAttributes[];

  beforeAll(async () => {
    languageId = suite.data.system.language.id;
    url = `/api/admin/languages/${languageId}/translations`;

    translations = await ioc.cradle.languageService.getOrCreateLanguageTranslations(languageId);

    const key = Object.keys(translations[0].messages)[0];

    translation = {
      ...translations[0].get(),
      messages: {
        ...translations[0].messages,
        [key]: 'new value',
      },
    };

    updateTranslations = [translation];
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('put', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, ['translations']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('put', url, ['translations'], {
        input: {
          translations: 'invalid-translation-object',
        },
      });
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ translations: updateTranslations });

      expect(status).toBe(200);
      expect(body).toBeArray();
      expect(body).not.toBeEmpty();

      const match = (body as any[]).find(
        (item) =>
          item.application === translation.application && item.section === translation.section
      );
      expect(match.messages).toStrictEqual(translation.messages);
    });
  });
};
