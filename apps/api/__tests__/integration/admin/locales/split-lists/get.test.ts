import request from 'supertest';

import type { LocaleSplitListInput } from '@intake24/common/types/http/admin';
import ioc from '@intake24/api/ioc';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const baseUrl = '/api/admin/locales';
  const permissions = ['locales', 'locales|split-lists'];

  let url: string;
  let invalidUrl: string;

  let splitLists: LocaleSplitListInput[];

  beforeAll(async () => {
    const { id: localeId } = suite.data.system.locale;

    splitLists = [
      { localeId, firstWord: 'first word', words: 'first1 first2 first3' },
      { localeId, firstWord: 'second word', words: 'second1 second2 second3' },
    ];

    await ioc.cradle.localeService.setSplitLists(localeId, splitLists);

    url = `${baseUrl}/${localeId}/split-lists`;
    invalidUrl = `${baseUrl}/invalid-locale/split-lists`;
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

      const lists = body.map(({ id, ...rest }: LocaleSplitListInput) => rest);
      expect(lists).toIncludeSameMembers(splitLists);
    });
  });
};
