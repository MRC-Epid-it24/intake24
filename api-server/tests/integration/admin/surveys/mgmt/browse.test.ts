import request from 'supertest';
import { Survey } from '@/db/models/system';
import { surveyStaff } from '@/services/acl.service';
import { SurveyRequest } from '@common/types/http';
import { mocker, suite, setPermission } from '../../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let survey: Survey;

  beforeAll(async () => {
    input = mocker.survey();
    survey = await Survey.create(input);

    url = `${baseUrl}/${survey.id}/mgmt`;
    invalidUrl = `${baseUrl}/invalid-survey-id/mgmt`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await setPermission('surveys-mgmt');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-mgmt' permission (surveyadmin)`, async () => {
    await setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-mgmt' permission (surveyStaff)`, async () => {
    await setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await setPermission(['surveys-mgmt', surveyStaff(survey.id)]);

    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await setPermission(['surveys-mgmt', 'surveyadmin']);

    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(404);
  });

  it('should return 200 and data/refs list', async () => {
    await setPermission(['surveys-mgmt', surveyStaff(survey.id)]);

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'meta']);
    expect(body.data).toBeArray();
  });
};
