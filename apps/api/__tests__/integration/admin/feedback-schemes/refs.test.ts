import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/feedback-schemes/refs';

  it('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  describe('authenticated / resource authorized', () => {
    it('should return 200 and refs', async () => {
      await suite.util.setPermission('feedback-schemes');

      await suite.sharedTests.assertReferencesResult('get', url, [
        'nutrientTypes',
        'physicalActivityLevels',
      ]);
    });
  });
};
