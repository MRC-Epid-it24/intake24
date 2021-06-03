import request from 'supertest';
import '../bootstrap';
import { suite } from '@tests/integration/helpers';
// import root from './root.test';
import admin from './admin/index.test';
import authentication from './authentication/index.test';
import portionSizes from './portion-sizes/index.test';
import subscriptions from './subscriptions/index.test';
import surveys from './surveys/index.test';

describe('API', () => {
  beforeAll(async () => {
    await suite.init();

    // Get access tokens for superuser, admin-user, respondent
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

  describe('Authentication', () => {
    describe('POST /api/auth/login', authentication.login);
    describe('POST /api/auth/login/alias', authentication.loginAlias);
    describe('POST /api/auth/login/token', authentication.loginToken);
    // describe('POST /api/auth/login/verify', authentication.verify);
    // describe('POST /api/auth/login/refresh', authentication.refresh);
    // describe('POST /api/auth/login/logout', authentication.logout);
  });

  describe('Push subscriptions', () => {
    describe('POST /api/subscriptions', subscriptions.subscribe);
    describe('DELETE /api/subscriptions', subscriptions.unsubscribe);
    describe('POST /api/subscriptions/push', subscriptions.push);
  });

  describe('Surveys', () => {
    describe('GET /api/surveys', surveys.browse);
    describe('GET /api/surveys/:surveyId', surveys.detail);
    describe('POST /api/surveys/:surveyId/generate-user', surveys.generateUser);
    // describe('POST /api/surveys/:surveyId/create-user', surveys.createUser);

    describe('GET /api/surveys/:surveyId/parameters', surveys.parameters);
    describe('GET /api/surveys/:surveyId/user-info', surveys.userInfo);
    describe('GET /api/surveys/:surveyId/session', surveys.getSession);
    describe('POST /api/surveys/:surveyId/session', surveys.setSession);
    // describe('POST /api/surveys/:surveyId/submissions', surveys.submissions);
    // describe('GET /api/surveys/:surveyId/follow-up', surveys.followUp);
    // describe('POST /api/surveys/:surveyId/request-help', surveys.requestHelp);
  });

  describe('Portion-sizes', () => {
    describe('GET /api/portion-sizes/as-served-sets', portionSizes.asServedSets);
    describe('GET /api/portion-sizes/as-served-sets/:id', portionSizes.asServedSet);
    describe('GET /api/portion-sizes/drinkware-sets', portionSizes.drinkwareSets);
    describe('GET /api/portion-sizes/drinkware-sets/:id', portionSizes.drinkwareSet);
    describe('GET /api/portion-sizes/guide-images', portionSizes.guideImages);
    describe('GET /api/portion-sizes/guide-images/:id', portionSizes.guideImage);
    describe('GET /api/portion-sizes/image-maps', portionSizes.imageMaps);
    describe('GET /api/portion-sizes/image-maps/:id', portionSizes.imageMap);
    describe('GET /api/portion-sizes/weight', portionSizes.weight);
  });

  describe('Admin', admin);

  afterAll(async () => {
    await suite.close();
  });
});
