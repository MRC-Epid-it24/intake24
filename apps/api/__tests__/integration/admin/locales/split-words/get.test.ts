import request from 'supertest';

import ioc from '@intake24/api/ioc';
import { suite } from '@intake24/api-tests/integration/helpers';
import type { SplitWordRequest } from '@intake24/common/types/http/admin';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|split-words'];

  let url: string;
  let invalidUrl: string;

  let splitWords: SplitWordRequest[];

  beforeAll(async () => {
    const { id, code: localeId } = suite.data.system.locale;

    splitWords = [
      { localeId, words: 'first1 first2 first3' },
      { localeId, words: 'second1 second2 second3' },
    ];

    await ioc.cradle.localeService.setSplitWords(id, splitWords);

    url = `${baseUrl}/${id}/split-words`;
    invalidUrl = `${baseUrl}/999999/split-words`;
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

    it('should return 200 and records', async () => {
      await suite.util.setPermission(permissions);

      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send();

      expect(status).toBe(200);
      expect(body).toBeArray();

      const lists = body.map(({ id, ...rest }: SplitWordRequest) => rest);
      expect(lists).toIncludeSameMembers(splitWords);
    });
  });
};
