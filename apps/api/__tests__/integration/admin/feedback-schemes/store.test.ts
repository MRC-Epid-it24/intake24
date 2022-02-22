import { pick } from 'lodash';
import request from 'supertest';
import { FeedbackSchemeCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';

export default (): void => {
  const url = '/api/admin/feedback-schemes';

  let input: FeedbackSchemeCreationAttributes;
  let output: FeedbackSchemeCreationAttributes;

  beforeAll(async () => {
    input = mocker.system.feedbackScheme();
    output = { ...input };
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing permission', async () => {
    await setPermission([]);

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission('feedback-schemes|create');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
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
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          name: [],
          type: 'invalidType',
          topFoods: [],
          // cards: 'notAnArray',
          demographicGroups: [
            {
              nutrientTypeId: '49',
              physicalActivityLevelId: null,
              sex: null,
              scaleSectors: [
                {
                  name: { en: 'Total fat' },
                  description: {
                    en: '<p>It is recommended that the energy (or calories)...</p>',
                  },
                  range: { start: 0, end: 100 },
                  sentiment: 'good',
                },
              ],
            },
          ],
          henryCoefficients: [{ weightCoefficient: 28.2, heightCoefficient: 859 }],
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

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(pick(body, Object.keys(output))).toEqual(output);
      expect(status).toBe(201);
    });

    it('should return 422 for duplicate name', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...mocker.system.feedbackScheme(), name: input.name });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name']);
    });
  });
};
