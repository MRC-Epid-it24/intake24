import request from 'supertest';
import { Survey } from '@/db/models/system';
import { surveyStaff } from '@/services/acl.service';
import { CreateSurveyRequest, SurveyRequest } from '@common/types/http';
import { mocker, suite, setPermission } from '../../helpers';

const refreshSurveyRecord = async (input: CreateSurveyRequest): Promise<Survey> => {
  const { id } = input;
  const [survey] = await Survey.findOrCreate({ where: { id }, defaults: input });

  return survey;
};

export default (): void => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidUrl: string;

  let input: SurveyRequest;
  let survey: Survey;

  beforeAll(async () => {
    input = mocker.survey();
    survey = await refreshSurveyRecord(input);

    url = `${baseUrl}/${survey.id}`;
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

  it('should return 403 when missing survey-specific permission', async () => {
    await setPermission('surveys-delete');

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-delete' permission (surveyadmin)`, async () => {
    await setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-delete' permission (surveyStaff)`, async () => {
    await setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await setPermission(['surveys-delete', 'surveyadmin']);

    const { status } = await request(suite.app)
      .delete(invalidUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(404);
  });

  it('should return 204 and no content (surveyadmin)', async () => {
    survey = await refreshSurveyRecord(input);
    await setPermission(['surveys-delete', 'surveyadmin']);

    const { status, body } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(204);
    expect(body).toBeEmpty();
  });

  it('should return 204 and no content (surveyStaff)', async () => {
    survey = await refreshSurveyRecord(input);
    await setPermission(['surveys-delete', surveyStaff(survey.id)]);

    const { status, body } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(204);
    expect(body).toBeEmpty();
  });
};
