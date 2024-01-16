import { randomUUID } from 'crypto';

import type { SurveyRatingInput } from '@intake24/common/types/http';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { SurveySubmission } from '@intake24/db/models';

export default () => {
  let url: string;
  let invalidUrl: string;

  let input: SurveyRatingInput;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.system.survey.slug}/rating`;
    invalidUrl = `/api/surveys/invalid-survey/rating`;

    const submission = mocker.system.submission(
      suite.data.system.survey.id,
      suite.data.system.respondent.id
    );
    await SurveySubmission.create(submission);

    input = {
      type: 'recall',
      rating: 2,
      submissionId: submission.id,
      comment: 'a comment',
    };
  });

  it('should return 401 when no / invalid token', async () => {
    await suite.sharedTests.assertMissingAuthentication('post', url);
  });

  it(`should return 403 when survey record (+survey permissions) doesn't exist`, async () => {
    await suite.sharedTests.assertMissingAuthorization('post', invalidUrl, {
      bearer: 'respondent',
    });
  });

  it('should return 400 for missing input data', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['type', 'rating'], {
      bearer: 'respondent',
    });
  });

  it('should return 400 for invalid input data', async () => {
    await suite.sharedTests.assertInvalidInput(
      'post',
      url,
      ['type', 'rating', 'submissionId', 'comment'],
      {
        bearer: 'respondent',
        input: {
          type: 'invalidType',
          rating: 'five',
          submissionId: randomUUID(),
          comment: ['comment'],
        },
      }
    );
  });

  it('should return 200', async () => {
    await suite.sharedTests.assertAcknowledged('post', url, { bearer: 'respondent', input });
  });
};
