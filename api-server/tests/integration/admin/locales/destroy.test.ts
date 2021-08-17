import request from 'supertest';
import { LocaleAttributes } from '@common/types/models';
import { suite, setPermission } from '@tests/integration/helpers';
import { Locale } from '@/db/models/system';

export default (): void => {
  const baseUrl = '/api/admin/locales';

  let url: string;
  let invalidUrl: string;

  let input: LocaleAttributes;
  let locale: Locale;

  beforeAll(async () => {
    const { id: langId } = suite.data.language;
    input = {
      id: 'en-au',
      englishName: 'English - Australia',
      localName: 'English - Australia',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-au',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };
    locale = await Locale.create(input);

    url = `${baseUrl}/${locale.id}`;
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
      await setPermission('locales-delete');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .delete(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it(`should return 403 - can't delete locale for now`, async () => {
      const { status } = await request(suite.app)
        .delete(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(403);
    });

    /* it('should return 204 and no content', async () => {
      const { status, body } = await request(suite.app)
        .delete(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(204);
      expect(body).toBeEmpty();
    }); */
  });
};
