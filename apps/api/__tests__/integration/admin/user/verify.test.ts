import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/user/verify';

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assertMissingAuthentication('post', url);
  });

  it('should return 200', async () => {
    await suite.sharedTests.assertAcknowledged('post', url);
  });
};
