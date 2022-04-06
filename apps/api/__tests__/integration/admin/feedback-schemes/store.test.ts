import { pick } from 'lodash';
import request from 'supertest';
import { FeedbackSchemeCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  const url = '/api/admin/feedback-schemes';
  const permissions = ['feedback-schemes', 'feedback-schemes|create'];

  let input: FeedbackSchemeCreationAttributes;
  let output: FeedbackSchemeCreationAttributes;

  beforeAll(async () => {
    input = mocker.system.feedbackScheme();
    output = { ...input };
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertMissingInput('post', url, [
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
      expect(body.ownerId).toBe(suite.data.system.user.id);
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
