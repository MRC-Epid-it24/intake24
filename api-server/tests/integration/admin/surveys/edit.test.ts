import { pick } from 'lodash';
import request from 'supertest';
import { Survey } from '@/db/models/system';
import { surveyStaff } from '@/services/acl.service';
import { SurveyRequest } from '@common/types/http';
import { mocker, suite, setPermission } from '../../helpers';

export default (): void => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let output: SurveyRequest;
  let survey: Survey;

  beforeAll(async () => {
    input = mocker.survey();
    survey = await Survey.create(input);
    output = { ...input };

    url = `${baseUrl}/${survey.id}/edit`;
    invalidUrl = `${baseUrl}/999999/edit`;
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

  it('should return 403 when missing survey-specific permission', async () => {
    await setPermission('surveys-edit');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-edit' permission (surveyadmin)`, async () => {
    await setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-edit' permission (surveyStaff)`, async () => {
    await setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await setPermission(['surveys-edit', 'surveyadmin']);

    const { status } = await request(suite.app)
      .get(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(404);
  });

  it('should return 200 and data/refs (surveyadmin)', async () => {
    await setPermission(['surveys-edit', 'surveyadmin']);

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'refs']);
    expect(pick(body.data, Object.keys(output))).toEqual(output);
  });

  it('should return 200 and data/refs (surveyStaff)', async () => {
    await setPermission(['surveys-edit', surveyStaff(survey.id)]);

    const { status, body } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['data', 'refs']);
    expect(pick(body.data, Object.keys(output))).toEqual(output);
  });
};
