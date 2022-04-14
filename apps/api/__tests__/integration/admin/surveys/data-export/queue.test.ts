import request from 'supertest';
import { mocker, suite, SetSecurableOptions } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys|data-export'];

  let input: { startDate: string; endDate: string };
  let survey: Survey;

  let url: string;
  let invalidUrl: string;

  let securable: SetSecurableOptions;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });
    const { id, startDate, endDate } = survey;

    input = {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };

    securable = { securableId: id, securableType: 'Survey' };

    url = `${baseUrl}/${id}/data-export`;
    invalidUrl = `${baseUrl}/999999/data-export`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { input, permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when survey record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl, { input });
    });

    it('should return 422 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['startDate', 'endDate']);
    });

    it('should return 422 for invalid input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['startDate', 'endDate'], {
        input: {
          startDate: 'notValidDate',
          endDate: 100,
        },
      });
    });

    it('should return 200 and job resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(200);
      expect(body).not.toBeEmpty();
    });
  });

  describe('authenticated / securables authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys']);
    });

    it('should return 200 and data when securable set', async () => {
      await suite.util.setSecurable({ ...securable, action: ['data-export'] });

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(200);
      expect(body).not.toBeEmpty();
    });

    it('should return 200 and data when owner set', async () => {
      await suite.util.setSecurable(securable);
      await survey.update({ ownerId: suite.data.system.user.id });

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send(input);

      expect(status).toBe(200);
      expect(body).not.toBeEmpty();
    });
  });
};
