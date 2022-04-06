import request from 'supertest';
import { pick } from 'lodash';
import { randomUUID } from 'crypto';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey, SurveySubmission } from '@intake24/db';
import { surveyStaff } from '@intake24/common/acl';
import ioc from '@intake24/api/ioc';
import { SurveySubmissionCreationAttributes } from '@intake24/common/types/models';

interface SurveyOutput
  extends Omit<SurveySubmissionCreationAttributes, 'startTime' | 'endTime' | 'submissionTime'> {
  startTime: string;
  endTime: string;
  submissionTime: string;
}

export default () => {
  const baseUrl = '/api/admin/surveys';

  let url: string;
  let invalidSurveyUrl: string;
  let invalidRespondentUrl: string;

  let survey: Survey;

  let input: SurveySubmissionCreationAttributes;
  let output: SurveyOutput;

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

    input = mocker.system.submission(survey.id, respondent.userId);
    output = {
      ...input,
      startTime: input.startTime.toISOString(),
      endTime: input.endTime.toISOString(),
      submissionTime: input.submissionTime.toISOString(),
    };
    const submission = await SurveySubmission.create(input);

    url = `${baseUrl}/${survey.id}/submissions/${submission.id}`;
    invalidSurveyUrl = `${baseUrl}/invalid-survey-id/submissions/${submission.id}`;
    invalidRespondentUrl = `${baseUrl}/${survey.id}/submissions/${randomUUID()}`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('get', url);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await suite.util.setPermission('surveys|submissions');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-submissions' permission (surveyadmin)`, async () => {
    await suite.util.setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-submissions' permission (surveyStaff)`, async () => {
    await suite.util.setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await suite.util.setPermission(['surveys|submissions', surveyStaff(survey.id)]);

    const { status } = await request(suite.app)
      .get(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await suite.util.setPermission(['surveys|submissions', 'surveyadmin']);

    await suite.sharedTests.assertMissingRecord('get', invalidSurveyUrl);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys|submissions', surveyStaff(survey.id)]);
    });

    it(`should return 404 when submission record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('get', invalidRespondentUrl);
    });

    it('should return 200 and data', async () => {
      const { status, body } = await request(suite.app)
        .get(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(200);
      expect(pick(body, Object.keys(output))).toEqual(output);
    });
  });
};
