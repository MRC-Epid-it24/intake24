import { pick } from 'lodash';
import request from 'supertest';
import { LocaleAttributes } from '@common/types/models';
import { suite, setPermission } from '@tests/integration/helpers';
import { FoodsLocale, SystemLocale } from '@intake24/db';

export default (): void => {
  const baseUrl = '/api/admin/locales';

  let url: string;
  let invalidUrl: string;

  let input: LocaleAttributes;
  let output: LocaleAttributes;
  let systemLocale: SystemLocale;

  beforeAll(async () => {
    const { id: langId } = suite.data.system.language;
    input = {
      id: 'en-ca',
      englishName: 'English - Canada',
      localName: 'English - Canada',
      respondentLanguageId: langId,
      adminLanguageId: langId,
      countryFlagCode: 'en-ca',
      prototypeLocaleId: null,
      textDirection: 'ltr',
    };

    await FoodsLocale.create(input);
    systemLocale = await SystemLocale.create(input);

    output = { ...input };

    url = `${baseUrl}/${systemLocale.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('locales-edit');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
