import request from 'supertest';

import type { LocaleSynonymSetInput } from '@intake24/common/types/http/admin';
import ioc from '@intake24/api/ioc';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|synonym-sets'];

  let url: string;
  let invalidUrl: string;

  let synonymSets: LocaleSynonymSetInput[];

  beforeAll(async () => {
    const { id: localeId } = suite.data.system.locale;

    synonymSets = [
      { localeId, synonyms: 'synonym1 synonym2 synonym3' },
      { localeId, synonyms: 'synonym11 synonym22 synonym33' },
    ];

    await ioc.cradle.localeService.setSynonymSets(localeId, synonymSets);

    url = `${baseUrl}/${localeId}/synonym-sets`;
    invalidUrl = `${baseUrl}/invalid-locale/synonym-sets`;
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

    it('should return 200 and records', async () => {
      await suite.util.setPermission(permissions);

      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send();

      expect(status).toBe(200);
      expect(body).toBeArray();

      const lists = body.map(({ id, ...rest }: LocaleSynonymSetInput) => rest);
      expect(lists).toIncludeSameMembers(synonymSets);
    });
  });
};
