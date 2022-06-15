import request from 'supertest';
import type { SurveySchemeCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveyScheme } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/survey-schemes';
  const permissions = ['survey-schemes', 'survey-schemes|data-export'];

  let url: string;
  let invalidUrl: string;

  let input: SurveySchemeCreationAttributes;
  let scheme: SurveyScheme;

  beforeAll(async () => {
    input = mocker.system.surveyScheme();
    scheme = await SurveyScheme.create(input);

    url = `${baseUrl}/${scheme.id}/data-export`;
    invalidUrl = `${baseUrl}/999999/data-export`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidUrl);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(body).toContainAllKeys([
        'user',
        'userCustom',
        'survey',
        'surveyCustom',
        'meal',
        'mealCustom',
        'food',
        'foodCustom',
        'foodFields',
        'foodNutrients',
        'portionSizes',
      ]);

      for (const field of Object.values(body)) {
        expect(field).toBeArray();
      }
    });
  });
};
