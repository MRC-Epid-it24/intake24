import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import type { LocaleSynonymSetInput } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|synonym-sets'];

  let url: string;
  let invalidUrl: string;
  let localeId: string;

  let synonymSets: LocaleSynonymSetInput[];

  beforeAll(async () => {
    localeId = suite.data.system.locale.id;

    synonymSets = [
      { localeId, synonyms: 'first1 first2 first3' },
      { localeId, synonyms: 'second1 second2 second3' },
      { localeId, synonyms: 'third1 third2 third3' },
    ];

    url = `${baseUrl}/${localeId}/synonym-sets`;
    invalidUrl = `${baseUrl}/invalid-locale/synonym-sets`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, [''], {
        input: [{ firstWord: [], synonyms: null }],
      });
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl, { input: synonymSets });
    });

    it('should return 200 and records #1 (empty)', async () => {
      await suite.util.setPermission(permissions);

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send([]);

      expect(status).toBe(200);
      expect(body).toBeArray();
      expect(body).toBeEmpty();
    });

    it('should return 200 and records #2 (new)', async () => {
      await suite.util.setPermission(permissions);

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(synonymSets);

      expect(status).toBe(200);
      expect(body).toBeArray();

      const lists = body.map(({ id, ...rest }: LocaleSynonymSetInput) => rest);
      expect(lists).toIncludeSameMembers(synonymSets);

      synonymSets = body.map((item: LocaleSynonymSetInput) => ({
        ...item,
        synonyms: 'updated words',
      }));
      synonymSets.shift();
    });

    it('should return 200 and records #3 (updated)', async () => {
      await suite.util.setPermission(permissions);

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(synonymSets);

      expect(status).toBe(200);
      expect(body).toBeArray();
      expect(body).toIncludeSameMembers(synonymSets);
    });
  });
};
