import request from 'supertest';
import { randomUUID } from 'crypto';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey, SurveySubmission } from '@intake24/db';
import { surveyStaff } from '@intake24/common/acl';
import ioc from '@intake24/api/ioc';

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidSurveyUrl: string;
  let invalidSubmissionUrl: string;

  let survey: Survey;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });

    const respondent = await ioc.cradle.adminSurveyService.createRespondent(
      survey.id,
      mocker.system.respondent()
    );

    const submission = await SurveySubmission.create(
      mocker.system.submission(survey.id, respondent.userId)
    );

    url = `${baseUrl}/${survey.id}/submissions/${submission.id}`;
    invalidSurveyUrl = `${baseUrl}/invalid-survey-id/submissions/${submission.id}`;
    invalidSubmissionUrl = `${baseUrl}/${survey.id}/submissions/${randomUUID()}`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('delete', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|submissions');

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-submissions' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-submissions' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .delete(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission(['surveys|submissions', surveyStaff(survey.id)]);

    const { status } = await request(suite.app)
      .delete(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.util.setPermission(['surveys|submissions', 'surveyadmin']);

    await suite.sharedTests.assertMissingRecord('delete', invalidSurveyUrl);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys|submissions', surveyStaff(survey.id)]);
    });

    it(`should return 404 when submission record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('delete', invalidSubmissionUrl);
    });

    it('should return 204 and no content', async () => {
      await suite.sharedTests.assertRecordDeleted('delete', url);
    });
  });
};
