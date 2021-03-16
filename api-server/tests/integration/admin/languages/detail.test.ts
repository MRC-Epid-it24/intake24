import { pick } from 'lodash';
import request from 'supertest';
import { Language } from '@/db/models/system';
import { Language as LanguageAttributes } from '@common/types/models';
import { suite, setPermission } from '@tests/integration/helpers';

export default (): void => {
  const baseUrl = '/api/admin/languages';

  let url: string;
  let invalidUrl: string;

  let input: Omit<LanguageAttributes, 'createdAt' | 'updatedAt'>;
  let output: Omit<LanguageAttributes, 'createdAt' | 'updatedAt'>;
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
      await setPermission('languages-detail');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data', 'refs']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });
  });
};
