import request from 'supertest';
import { mocker, suite, SetSecurableOptions } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys|respondents'];

  let url: string;
  let invalidUrl: string;

  let survey: Survey;

  let securable: SetSecurableOptions;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });
    const { id } = survey;

    securable = { securableId: id, securableType: 'Survey' };

    url = `${baseUrl}/${id}/respondents/export-auth-urls`;
    invalidUrl = `${baseUrl}/999999/respondents/export-auth-urls`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assert401and403('post', url, { permissions });
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when survey record doesn't exist`, async () => {
      await suite.sharedTests.assertMissingRecord('post', invalidUrl);
    });

    it('should return 200 and job resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send();

      expect(status).toBe(200);
      expect(body).not.toBeEmpty();
    });
  });

  describe('authenticated / securables authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(['surveys']);
    });

    it('should return 200 and data when securable set', async () => {
      await suite.util.setSecurable({ ...securable, action: ['respondents'] });

      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .send();

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
        .send();

      expect(status).toBe(200);
      expect(body).not.toBeEmpty();
    });
  });
};
