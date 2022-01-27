import { pick } from 'lodash';
import request from 'supertest';
import { SurveySchemeCreationAttributes } from '@intake24/common/types/models';
import { mocker, suite, setPermission } from '@intake24/api-tests/integration/helpers';
import { SurveyScheme } from '@intake24/db';

export default (): void => {
  const baseUrl = '/api/admin/survey-schemes';

  let url: string;
  let invalidUrl: string;

  let input: SurveySchemeCreationAttributes;
  let updateInput: SurveySchemeCreationAttributes;
  let scheme: SurveyScheme;

  beforeAll(async () => {
    input = mocker.system.surveyScheme();
    updateInput = mocker.system.surveyScheme();

    scheme = await SurveyScheme.create(input);

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
      await setPermission('survey-schemes|edit');
    });

    it('should return 422 for missing input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'type', 'meals', 'questions', 'dataExport']);
    });

    it('should return 422 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .put(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          name: [],
          type: {},
          meals: 10,
          questions: 'invalidQuestions',
          dataExport: 5,
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['name', 'type', 'meals', 'questions', 'dataExport']);
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
