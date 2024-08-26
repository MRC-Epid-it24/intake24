import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/ping';

  it('should return 200', async () => {
    await suite.sharedTests.assertAcknowledged('get', url);
  });
};
