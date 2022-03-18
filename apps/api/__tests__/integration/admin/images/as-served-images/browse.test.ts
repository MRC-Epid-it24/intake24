import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/images/as-served/asServedSetForImages/images';
  const invalidUrl = '/api/admin/images/as-served/InvalidAsServedSetForImages/images';

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  describe('authenticated / authorized', () => {
    beforeAll(async () => {
      await setPermission('as-served|browse');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and paginated results', async () => {
      await setPermission('as-served|browse');

      await suite.sharedTests.assertPaginatedResult('get', url, true);
    });
  });
};
