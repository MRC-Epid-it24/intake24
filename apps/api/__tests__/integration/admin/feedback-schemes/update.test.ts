import { pick } from 'lodash';
import request from 'supertest';
import { FeedbackSchemeCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { FeedbackScheme } from '@intake24/db';

export default (): void => {
  const baseUrl = '/api/admin/feedback-schemes';

  let url: string;
  let invalidUrl: string;

  let input: FeedbackSchemeCreationAttributes;
  let updateInput: FeedbackSchemeCreationAttributes;
  let scheme: FeedbackScheme;

  beforeAll(async () => {
    input = mocker.system.feedbackScheme();
    updateInput = mocker.system.feedbackScheme();

    scheme = await FeedbackScheme.create(input);

    url = `${baseUrl}/${scheme.id}`;
    invalidUrl = `${baseUrl}/999999`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).put(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .put(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('feedback-schemes|edit');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'name',
        'type',
        'topFoods.max',
        'topFoods.colors',
        'topFoods.nutrientTypes',
        // 'cards',
        'demographicGroups',
        'henryCoefficients',
      ]);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          name: [],
          type: 'invalidType',
          topFoods: [],
          // cards: 'notAnArray',
          demographicGroups: [
            {
              nutrientRuleType: 'percentage_of_energy',
              nutrientTypeId: '49',
              physicalActivityLevelId: null,
            },
          ],
          henryCoefficients: [{ age: { start: 0, end: 3 }, constant: -371 }],
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'name',
        'type',
        'topFoods.max',
        'topFoods.colors',
        'topFoods.nutrientTypes',
        // 'cards',
        'demographicGroups',
        'henryCoefficients',
      ]);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .put(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(404);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(updateInput);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(updateInput))).toEqual(updateInput);
    });
  });
};
