import { pick } from 'lodash';
import request from 'supertest';
import { SurveyRequest } from '@common/types/http';
import { mocker, suite, setPermission } from '../../helpers';

export default (): void => {
  const url = '/api/admin/surveys';

  let input: SurveyRequest;
  let output: SurveyRequest;

  beforeAll(async () => {
    input = mocker.survey();
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
      await setPermission('surveys-create');
    });

    it('should return 422 when missing input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'id',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'feedbackEnabled',
        'numberOfSubmissionsForFeedback',
        'storeUserSessionOnServer',
        'maximumDailySubmissions',
        'minimumSubmissionInterval',
      ]);
    });

    it('should return 422 when invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({
          id: null,
          state: 10,
          startDate: 'notValidDate',
          endDate: 100,
          schemeId: 'invalidSchemeId',
          locale: 10,
          supportEmail: 'thisIsNotValidEmail',
          allowGenUsers: 'no',
          feedbackEnabled: 10,
          numberOfSubmissionsForFeedback: 'number',
          storeUserSessionOnServer: 'yes',
          maximumDailySubmissions: 'NaN',
          minimumSubmissionInterval: { nan: 5 },
        });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys([
        'id',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'supportEmail',
        'allowGenUsers',
        'feedbackEnabled',
        'numberOfSubmissionsForFeedback',
        'storeUserSessionOnServer',
        'maximumDailySubmissions',
        'minimumSubmissionInterval',
      ]);
    });

    it('should return 201 and new resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(201);
      expect(body).toContainAllKeys(['data']);
      expect(pick(body.data, Object.keys(output))).toEqual(output);
    });

    it('should return 422 when duplicate id', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send({ ...mocker.survey(), id: input.id });

      expect(status).toBe(422);
      expect(body).toContainAllKeys(['errors', 'success']);
      expect(body.errors).toContainAllKeys(['id']);
    });
  });
};
