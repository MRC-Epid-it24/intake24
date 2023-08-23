import type { SurveyRequestHelpInput } from '@intake24/common/types/http';
import { suite } from '@intake24/api-tests/integration/helpers';

export default () => {
  let url: string;
  let invalidUrl: string;

  let input: SurveyRequestHelpInput;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.system.survey.slug}/request-help`;
    invalidUrl = `/api/surveys/invalid-survey/request-help`;

    input = {
      name: 'John',
      email: 'test@example.com',
      phone: '+44 1234 567 890',
      message: 'Help me!',
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

  it('should return 422 for missing input data', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['name', 'email', 'phone'], {
      bearer: 'respondent',
    });
  });

  it('should return 422 when both email and phone empty', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['name', 'email', 'phone'], {
      bearer: 'respondent',
      input: { email: null, phone: null },
    });
  });

  it('should return 422 for invalid input data', async () => {
    await suite.sharedTests.assertInvalidInput('post', url, ['name', 'email', 'phone'], {
      bearer: 'respondent',
      input: { name: [], email: 'notAnEmailAddress', phone: { myPhone: '+44 1234 567 890' } },
    });
  });

  it('should return 200 | email & phone', async () => {
    await suite.sharedTests.assertAcknowledged('post', url, { bearer: 'respondent', input });
  });

  it('should return 200 | email only', async () => {
    await suite.sharedTests.assertAcknowledged('post', url, {
      bearer: 'respondent',
      input: { name: 'John', email: 'test@example.com', message: 'Help me!' },
    });
  });

  it('should return 200 | phone only', async () => {
    await suite.sharedTests.assertAcknowledged('post', url, {
      bearer: 'respondent',
      input: { name: 'John', phone: '+44 1234 567 890', message: 'Help me!' },
    });
  });
};
