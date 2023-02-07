import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Category } from '@intake24/db';

export default () => {
  const url = '/api/admin/categories';

  beforeAll(async () => {
    await Category.create(mocker.foods.category());
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  describe('authenticated / resource authorized', () => {
    it('should return 200 and paginated results (permission: locales)', async () => {
      await suite.util.setPermission('locales');

      await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
    });

    it('should return 200 and paginated results (permission: survey-schemes)', async () => {
      await suite.util.setPermission('survey-schemes');

      await suite.sharedTests.assertPaginatedResult('get', url, { result: true });
    });
  });
};
