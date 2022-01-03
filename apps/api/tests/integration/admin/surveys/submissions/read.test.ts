import request from 'supertest';
import { pick } from 'lodash';
import * as uuid from 'uuid';
import { mocker, suite, setPermission } from '@tests/integration/helpers';
import { Survey, SurveySubmission } from '@api/db';
import { surveyStaff } from '@api/services/core/auth';
import ioc from '@api/ioc';
import { SurveySubmissionCreationAttributes } from '@common/types/models';

interface SurveyOutput
  extends Omit<SurveySubmissionCreationAttributes, 'startTime' | 'endTime' | 'submissionTime'> {
  startTime: string;
  endTime: string;
  submissionTime: string;
}

export default (): void => {
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
    invalidRespondentUrl = `${baseUrl}/${survey.id}/submissions/${uuid.v4()}`;
  });

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).get(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 403 when missing survey-specific permission', async () => {
    await setPermission('surveys-submissions');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-submissions' permission (surveyadmin)`, async () => {
    await setPermission('surveyadmin');

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when missing 'surveys-submissions' permission (surveyStaff)`, async () => {
    await setPermission(surveyStaff(survey.id));

    const { status } = await request(suite.app)
      .get(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 403 when record doesn't exist -> no survey permission created yet`, async () => {
    await setPermission(['surveys-submissions', surveyStaff(survey.id)]);

    const { status } = await request(suite.app)
      .get(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(403);
  });

  it(`should return 404 when record doesn't exist`, async () => {
    await setPermission(['surveys-submissions', 'surveyadmin']);

    const { status } = await request(suite.app)
      .get(invalidSurveyUrl)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user);

    expect(status).toBe(404);
  });

  describe('with correct permissions', () => {
    beforeAll(async () => {
      await setPermission(['surveys-submissions', surveyStaff(survey.id)]);
    });

    it(`should return 404 when submission record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .get(invalidRespondentUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user);

      expect(status).toBe(404);
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
