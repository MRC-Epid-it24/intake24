import request from 'supertest';
import { suite } from '@intake24/api-tests/integration/helpers';
import { UserPhysicalDataAttributes } from '@intake24/common/types/models/system';
import { UserPhysicalData } from '@intake24/db';

export default (): void => {
  let url: string;

  let userPhysicalData: UserPhysicalDataAttributes;

  beforeAll(async () => {
    url = '/api/user/physical-data';

    const { userId } = suite.data.system.respondent;

    userPhysicalData = {
      userId,
      sex: 'f',
      weightKg: 70,
      heightCm: 175,
      physicalActivityLevelId: '1',
      birthdate: 1965,
      weightTarget: 'keep_weight',
    };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return null when no physical data for user', async () => {
    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(200);
    expect(body).toBeNull();
  });

  describe('with user physical data created', () => {
    beforeAll(async () => {
      await UserPhysicalData.create(userPhysicalData);
    });

    it('should return 200 and user physical data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.respondent);

      expect(status).toBe(200);
      expect(body).toStrictEqual(userPhysicalData);
    });
  });
};
