import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';
import { weightTargetsData } from '@intake24/common/feedback';

export default () => {
  const url = '/api/feedback';

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('get', url);
  });

  it('should return 200 and feedback data', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['nutrientTypes', 'physicalActivityLevels', 'weightTargets']);
    expect(body.weightTargets).toStrictEqual(weightTargetsData);
  });
};
