import '../../bootstrap';
import request from 'supertest';
import app from '@/app';
import ioc from '@/ioc';
import { prepare } from './mocks/setup';
// import root from './root.test';
import authentication from './authentication/index.test';
import admin from './admin/index.test';
import portionSizes from './portion-sizes/index.test';

describe('API', function () {
  before(async function () {
    const { config, logger } = ioc.cradle;
    this.app = await app({ config, logger });
    this.data = await prepare();

    const adminRes = await request(this.app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ email: 'testAdmin@example.com', password: 'testAdminPassword' });

    const userRes = await request(this.app)
      .post('/api/login')
      .set('Accept', 'application/json')
      .send({ email: 'testUser@example.com', password: 'testUserPassword' });

    const respondentRes = await request(this.app)
      .post('/api/login/alias')
      .set('Accept', 'application/json')
      .send({
        surveyId: 'test-survey',
        userName: 'testRespondent',
        password: 'testRespondentPassword',
      });

    this.bearer = {
      admin: `Bearer ${adminRes.body.accessToken}`,
      user: `Bearer ${userRes.body.accessToken}`,
      respondent: `Bearer ${respondentRes.body.accessToken}`,
    };
  });

  // describe('Root', root);

  describe('Authentication', function () {
    describe('POST /api/login', authentication.login);
    describe('POST /api/login/alias', authentication.loginAlias);
    describe('POST /api/login/token', authentication.loginToken);
  });

  describe('Portion-sizes', function () {
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

  describe('Admin', function () {
    describe('GET /admin/profile', admin.profile);

    // Jobs
    const { jobs } = admin;
    describe('GET /api/admin/jobs', jobs.browse);
    describe('GET /api/admin/languages/:jobId', jobs.detail);
    describe('GET /api/admin/languages/:jobId/download', jobs.download);

    // Languages
    const { languages } = admin;
    describe('GET /api/admin/languages', languages.browse);
    describe('GET /api/admin/languages/create', languages.create);
    describe('POST /admin/languages', languages.store);
    describe('GET /api/admin/languages/:languageId', languages.detail);
    describe('GET /api/admin/languages/:languageId/edit', languages.edit);
    describe('PUT /api/admin/languages/:languageId', languages.update);
    describe('DELETE /api/admin/languages/:languageId', languages.destroy);

    // Locales
    const { locales } = admin;
    describe('GET /api/admin/locales', locales.browse);
    describe('GET /api/admin/locales/create', locales.create);
    describe('POST /admin/locales', locales.store);
    describe('GET /api/admin/locales/:localeId', locales.detail);
    describe('GET /api/admin/locales/:localeId/edit', locales.edit);
    describe('PUT /api/admin/locales/:localeId', locales.update);
    describe('DELETE /api/admin/locales/:localeId', locales.destroy);

    // Permissions
    const { permissions } = admin;
    describe('GET /api/admin/permissions', permissions.browse);
    describe('GET /api/admin/permissions/create', permissions.create);
    describe('POST /api/admin/permissions', permissions.store);
    describe('GET /api/admin/permissions/:permissionId', permissions.detail);
    describe('GET /api/admin/permissions/:permissionId/edit', permissions.edit);
    describe('PUT /api/admin/permissions/:permissionId', permissions.update);
    describe('DELETE /api/admin/permissions/:permissionId', permissions.destroy);

    // Roles
    const { roles } = admin;
    describe('GET /api/admin/roles', roles.browse);
    describe('GET /api/admin/roles/create', roles.create);
    describe('POST /api/admin/roles', roles.store);
    describe('GET /api/admin/roles/:roleId', roles.detail);
    describe('GET /api/admin/roles/:roleId/edit', roles.edit);
    describe('PUT /api/admin/roles/:roleId', roles.update);
    describe('DELETE /api/admin/roles/:roleId', roles.destroy);

    // Schemes
    const { schemes } = admin;
    describe('GET /api/admin/schemes', schemes.browse);
    describe('GET /api/admin/schemes/create', schemes.create);
    describe('POST /api/admin/schemes', schemes.store);
    describe('GET /api/admin/schemes/:schemeId', schemes.detail);
    describe('GET /api/admin/schemes/:schemeId/edit', schemes.edit);
    describe('PUT /api/admin/schemes/:schemeId', schemes.update);
    describe('DELETE /api/admin/schemes/:schemeId', schemes.destroy);

    // Surveys
    const { surveys } = admin;
    describe('GET /api/admin/surveys', surveys.browse);
    describe('GET /api/admin/surveys/create', surveys.create);
    describe('POST /api/admin/surveys', surveys.store);
    describe('GET /api/admin/surveys/:surveyId', surveys.detail);
    describe('GET /api/admin/surveys/:surveyId/edit', surveys.edit);
    describe('PUT /api/admin/surveys/:surveyId', surveys.update);
    describe('DELETE /api/admin/surveys/:surveyId', surveys.destroy);

    // Surveys user management
    const { mgmt } = surveys;
    describe('GET /api/admin/surveys/:surveyId/mgmt', mgmt.browse);
    describe('GET /api/admin/surveys/:surveyId/mgmt/available', mgmt.available);
    // describe('PUT /api/admin/surveys/:surveyId/mgmt/:userId', surveys.mgmt.update);

    // Surveys respondents
    // describe('GET /api/admin/surveys/:surveyId/respondents', surveys.respondents.browse);
    // describe('POST /api/admin/surveys/:surveyId/respondents', surveys.respondents.store);
    // describe('POST /api/admin/surveys/:surveyId/upload', surveys.respondents.upload);
    // describe('POST /api/admin/surveys/:surveyId/export-auth-urls', surveys.respondents.exportAuthUrls);
    // describe('PUT /api/admin/surveys/:surveyId/respondents/:userId', surveys.respondents.update);
    // describe('DELETE /api/admin/surveys/:surveyId/respondents/:userId', surveys.respondents.destroy);

    // Surveys submissions
    // describe('GET /api/admin/surveys/:surveyId/submissions', surveys.respondents.submissions.browse);
    // describe('GET /api/admin/surveys/:surveyId/submissions/:submissionId', surveys.respondents.submissions.detail);
    // describe('DELETE /api/admin/surveys/:surveyId/submissions/:submissionId', surveys.respondents.submissions.destroy);

    // Surveys data-export
    const { dataExport } = surveys;
    describe('POST /api/admin/surveys/:surveyId/data-export', dataExport.queue);
    describe('POST /api/admin/surveys/:surveyId/data-export/sync', dataExport.sync);

    // Tasks
    const { tasks } = admin;
    describe('GET /api/admin/tasks', tasks.browse);
    describe('GET /api/admin/tasks/create', tasks.create);
    describe('POST /api/admin/tasks', tasks.store);
    describe('GET /api/admin/tasks/:taskId', tasks.detail);
    describe('GET /api/admin/tasks/:taskId/edit', tasks.edit);
    describe('PUT /api/admin/tasks/:taskId', tasks.update);
    describe('DELETE /api/admin/tasks/:taskId', tasks.destroy);

    // Users
    const { users } = admin;
    describe('GET /api/admin/users', users.browse);
    describe('GET /api/admin/users/create', users.create);
    describe('POST /api/admin/users', users.store);
    describe('GET /api/admin/users/:userId', users.detail);
    describe('GET /api/admin/users/:userId/edit', users.edit);
    describe('PUT /api/admin/users/:userId', users.update);
    describe('DELETE /api/admin/users/:userId', users.destroy);
  });
});
