import request from 'supertest';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { FoodGroup } from '@api/db';

export default (): void => {
  const url = '/api/admin/food-groups';

  beforeAll(async () => {
    await FoodGroup.create(mocker.foods.foodGroup());
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it('should return 200 and data/refs list', async () => {
    await setPermission('food-groups-browse');

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'meta']);
    expect(body.data).toBeArray();
    expect(body.data).not.toBeEmpty();
  });
};
