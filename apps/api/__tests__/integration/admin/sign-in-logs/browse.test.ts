import { suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/sign-in-logs';

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 200 and paginated results', async () => {
    await setPermission('sign-in-logs|browse');

    await suite.sharedTests.assertPaginatedResult('get', url, false);
  });
};
