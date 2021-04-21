import request from 'supertest';
import { suite } from '@tests/integration/helpers';

export default (): void => {
  let url: string;
  let invalidUrl: string;

  beforeAll(async () => {
    url = `/api/surveys/${suite.data.survey.id}/generate-user`;
    invalidUrl = `/api/surveys/invalid-survey/generate-user`;
  });

  it(`should return 404 when record doesn't exist`, async () => {
    const { status } = await request(suite.app)
      .post(invalidUrl)
      .set('Accept', 'application/json')
      .send({ reCaptchaToken: 'reCaptchaToken' });

    expect(status).toBe(404);
  });

  it(`should return 403 when user generation disabled`, async () => {
    await suite.data.survey.update({ allowGenUsers: false });

    const { status } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ reCaptchaToken: 'reCaptchaToken' });

    expect(status).toBe(403);
  });

  it('should return 200 and public survey record', async () => {
    await suite.data.survey.update({ allowGenUsers: true });

    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .send({ reCaptchaToken: 'reCaptchaToken' });

    expect(status).toBe(200);
    expect(body).toContainAllKeys(['userName', 'password']);
  });
};
