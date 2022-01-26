import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import { defaultHenryCoefficients, weightTargetsData } from '@intake24/common/feedback';

export default (): void => {
  const url = '/api/feedback';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 200 and feedback data', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toContainAllKeys([
      'demographicGroups',
      // 'fiveADay', no data -> to be moved to scheme eventually
      'foodGroups',
      'henryCoefficients',
      'nutrientTypes',
      'physicalActivityLevels',
      'weightTargets',
    ]);
    expect(body.henryCoefficients).toStrictEqual(defaultHenryCoefficients);
    expect(body.weightTargets).toStrictEqual(weightTargetsData);
  });
};
