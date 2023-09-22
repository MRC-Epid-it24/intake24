import fs from 'fs-extra';
import request from 'supertest';

import type { SetSecurableOptions } from '@intake24/api-tests/integration/helpers';
import { mocker, suite } from '@intake24/api-tests/integration/helpers';
import { Survey } from '@intake24/db';

export default () => {
  const baseUrl = '/api/admin/surveys';
  const permissions = ['surveys', 'surveys|respondents'];

  let url: string;
  let invalidUrl: string;

  let survey: Survey;

  const fileName = 'uploadRespondents.csv';
  let filePath: string;

  let securable: SetSecurableOptions;

  beforeAll(async () => {
    const surveyInput = mocker.system.survey();
    survey = await Survey.create({
      ...surveyInput,
      startDate: new Date(surveyInput.startDate),
      endDate: new Date(surveyInput.endDate),
    });
    const { id } = survey;

    filePath = suite.files.data.csv;

    securable = { securableId: survey.id, securableType: 'Survey' };

    url = `${baseUrl}/${id}/respondents/upload`;
    invalidUrl = `${baseUrl}/999999/respondents/upload`;
  });

  test('missing authentication / authorization', async () => {
    await suite.sharedTests.assertMissingAuthentication('post', url);
  });

  it('should return 403 when missing permissions', async () => {
    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.user)
      .attach('file', fs.createReadStream(filePath), fileName);

    expect(status).toBe(403);
  });

  describe('authenticated / resource authorized', () => {
    beforeAll(async () => {
      await suite.util.setPermission(permissions);
    });

    it(`should return 404 when survey record doesn't exist`, async () => {
      const { status } = await request(suite.app)
        .post(invalidUrl)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .attach('file', fs.createReadStream(filePath), fileName);

      expect(status).toBe(404);
    });

    it('should return 400 for missing input data', async () => {
      await suite.sharedTests.assertInvalidInput('post', url, ['file']);
    });

    it('should return 400 for invalid input data', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .field('file', '../../asServedSet_001');

      expect(status).toBe(400);
      expect(body).toContainAllKeys(['errors', 'message']);
      expect(body.errors).toContainAllKeys(['file']);
    });

    it('should return 200 and job resource', async () => {
      const { status, body } = await request(suite.app)
        .post(url)
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.user)
        .attach('file', fs.createReadStream(filePath), fileName);

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
        .attach('file', fs.createReadStream(filePath), fileName);

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
        .attach('file', fs.createReadStream(filePath), fileName);

      expect(status).toBe(200);
      expect(body).not.toBeEmpty();
    });
  });
};
