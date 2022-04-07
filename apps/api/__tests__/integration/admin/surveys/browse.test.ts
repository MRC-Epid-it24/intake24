import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/surveys';

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 200 and empty list when no survey-permissions', async () => {
    await suite.util.setPermission('surveys|browse');

    await suite.sharedTests.assertPaginatedResult('get', url, { result: false });
  });

  it('should return 200 and paginated results', async () => {
    await suite.util.setPermission(['surveys|browse', 'surveyadmin']);

    await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
  });
};
