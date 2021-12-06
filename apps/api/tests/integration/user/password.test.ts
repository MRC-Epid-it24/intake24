import request from 'supertest';
import { suite } from '@tests/integration/helpers';

export default (): void => {
  const url = '/api/user/password';

  it('should return 401 when no / invalid token', async () => {
    const { status } = await request(suite.app).post(url).set('Accept', 'application/json');

    expect(status).toBe(401);
  });

  it('should return 422 when missing input data', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent);

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['password', 'passwordConfirm', 'passwordCurrent']);
  });

  it('should return 422 for weak new passwords', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        password: 'weakpassword',
        passwordConfirm: 'weakpassword',
        passwordCurrent: 'testRespondentPassword',
      });

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['password', 'passwordConfirm']);
  });

  it('should return 422 for not matching new passwords', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        password: 'newPassword123',
        passwordConfirm: 'notMatchingNewPassword123',
        passwordCurrent: 'testRespondentPassword',
      });

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['passwordConfirm']);
  });

  it('should return 422 when invalid current password', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        password: 'newPassword123',
        passwordConfirm: 'newPassword123',
        passwordCurrent: 'invalidPassword',
      });

    expect(status).toBe(422);
    expect(body).toContainAllKeys(['errors', 'success']);
    expect(body.errors).toContainAllKeys(['passwordCurrent']);
  });

  it('should return 200', async () => {
    const { status, body } = await request(suite.app)
      .post(url)
      .set('Accept', 'application/json')
      .set('Authorization', suite.bearer.respondent)
      .send({
        password: 'newPassword123',
        passwordConfirm: 'newPassword123',
        passwordCurrent: 'testRespondentPassword',
      });

    expect(status).toBe(200);
    expect(body).toBeEmpty();
  });
};
