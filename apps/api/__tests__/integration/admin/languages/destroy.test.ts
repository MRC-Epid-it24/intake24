import request from 'supertest';
import { LanguageCreationAttributes } from '@intake24/common/types/models';
import { suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { Language, SystemLocale } from '@intake24/db';

export default (): void => {
  const baseUrl = '/api/admin/languages';

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

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).delete(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('languages|delete');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .delete(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 204 and no content', async () => {
      const { status, body } = await request(suite.app)
        .delete(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(204);
      expect(body).toBeEmpty();
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
