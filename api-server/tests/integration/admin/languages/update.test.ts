import { pick } from 'lodash';
import request from 'supertest';
import { Language } from '@/db/models/system';
import { Language as LanguageAttributes } from '@common/types/models';
import { suite, setPermission } from '../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/languages';

  let url: string;
  let invalidUrl: string;

  let input: Omit<LanguageAttributes, 'createdAt' | 'updatedAt'>;
  let updateInput: Omit<LanguageAttributes, 'createdAt' | 'updatedAt'>;
  let output: Omit<LanguageAttributes, 'createdAt' | 'updatedAt'>;
  let language: Language;

  beforeAll(async () => {
    input = {
      id: 'es-ec',
      englishName: 'Spanish - Ecuador',
      localName: 'Spanish - Ecuador',
      countryFlagCode: 'es-ec',
      textDirection: 'ltr',
    };
    updateInput = {
      id: 'es-sv',
      englishName: 'Spanish - El Salvador',
      localName: 'Spanish - El Salvador',
      countryFlagCode: 'es-sv',
      textDirection: 'ltr',
    };

    const { id } = input;
    output = { ...updateInput, id };

    language = await Language.create(input);

    url = `${baseUrl}/${language.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).put(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('languages-edit');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'englishName',
        'localName',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          englishName: { name: 'United Kingdom' },
          localName: ['United Kingdom'],
          countryFlagCode: false,
          textDirection: 'wrongDirection',
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'englishName',
        'localName',
        'countryFlagCode',
        'textDirection',
      ]);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
    });

    it('should return 200 and data/refs', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(body).toContainAllKeys(['data', 'refs']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });
  });
};
