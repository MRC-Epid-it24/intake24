import request from 'supertest';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Food, FoodGroup } from '@api/db';

export default (): void => {
  const baseUrl = '/api/admin/food-groups';

  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    const { id } = await FoodGroup.create(mocker.foods.foodGroup());

    url = `${baseUrl}/${id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).delete(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('food-groups-delete');
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .delete(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
    });

    it('should return 204 and no content', async () => {
      const { status, body } = await request(suite.app)
        .delete(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(204);
      expect(body).toBeEmpty();
    });

    it(`should return 403 when food is assigned to food group`, async () => {
      const { id } = await FoodGroup.create(mocker.foods.foodGroup());
      await Food.create(mocker.foods.food(id));

      const { status } = await request(suite.app)
        .delete(`${baseUrl}/${id}`)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(403);
    });
  });
};
