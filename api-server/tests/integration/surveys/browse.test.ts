import request from 'supertest';
import { suite } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/surveys';

  it('should return 200 and public survey list', async () => {
    const { status, body } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(200);
    expect(body).toBeArray();
  });
};
