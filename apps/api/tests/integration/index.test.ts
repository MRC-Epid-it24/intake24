import request from 'supertest';
import '../bootstrap';
import { suite } from '@tests/integration/helpers';
// import root from './root.test';
import admin from './admin/index.test';
import authentication from './authentication/index.test';
import feedback from './feedback/index.test';
import portionSizes from './portion-sizes/index.test';
import subscriptions from './subscriptions/index.test';
import surveys from './surveys/index.test';
import user from './user/index.test';

describe('API', () => {
  beforeAll(async () => {
    await suite.init();

    // Get access tokens for superuser, user (admin tool), respondent (survey frontend)
    const superuserRes = await request(suite.app)
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ email: 'testAdmin@example.com', password: 'testAdminPassword' });

    const userRes = await request(suite.app)
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'testUserPassword' });

    const respondentRes = await request(suite.app)
      .post('/api/auth/login/alias')
      .set('Accept', 'application/json')
      .send({
        surveyId: 'test-survey',
        userName: 'testRespondent',
        password: 'testRespondentPassword',
      });

    suite.bearer = {
      superuser: `Bearer ${superuserRes.body.accessToken}`,
      user: `Bearer ${userRes.body.accessToken}`,
      respondent: `Bearer ${respondentRes.body.accessToken}`,
    };
  });

  // describe('Root', root);

  describe('/api/auth', authentication);
  describe('/api/subscriptions', subscriptions);
  describe('/api/feedback', feedback);
  describe('/api/surveys', surveys);
  describe('/api/portion-sizes', portionSizes);
  describe('/api/user', user);

  describe('/api/admin', admin);

  afterAll(async () => {
    await suite.close();
  });
});
