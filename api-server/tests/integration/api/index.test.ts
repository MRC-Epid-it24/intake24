import '../../bootstrap';
import request from 'supertest';
import app from '@/app';
import { prepare, cleanup } from './mocks/setup';
import root from './root.test';
import authentication from './authentication/index.test';
import admin from './admin/index.test';

describe('API', function () {
  before(async function () {
    this.app = await app();
    this.data = await prepare();
  });

  after(async function () {
    await cleanup();
  });

  describe('Root', root);

  describe('Authentication', function () {
    describe('POST /api/login', authentication.login);
    describe('POST /api/login/alias', authentication.loginAlias);
    describe('POST /api/login/token', authentication.loginToken);
  });

  describe('Admin', function () {
    before(async function () {
      const res = await request(this.app)
        .post('/api/login')
        .set('Accept', 'application/json')
        .send({ email: 'testUser@example.com', password: 'testUserPassword' });

      this.bearer = `Bearer ${res.body.accessToken}`;
    });

    describe('GET /admin/profile', admin.profile);

    // Permissions
    const { permissions } = admin;
    describe('GET /api/admin/permissions', permissions.list);
    describe('GET /api/admin/permissions/create', permissions.create);
    describe('POST /api/admin/permissions', permissions.store);
    describe('GET /api/admin/permissions/:permissionId', permissions.detail);
    describe('GET /api/admin/permissions/:permissionId/edit', permissions.edit);
    describe('PUT /api/admin/permissions/:permissionId', permissions.update);
    describe('DELETE /api/admin/permissions/:permissionId', permissions.destroy);

    // Roles
    const { roles } = admin;
    describe('GET /api/admin/roles', roles.list);
    describe('GET /api/admin/roles/create', roles.create);
    describe('POST /api/admin/roles', roles.store);
    describe('GET /api/admin/roles/:roleId', roles.detail);
    describe('GET /api/admin/roles/:roleId/edit', roles.edit);
    describe('PUT /api/admin/roles/:roleId', roles.update);
    describe('DELETE /api/admin/roles/:roleId', roles.destroy);

    // Users
    const { users } = admin;
    describe('GET /api/admin/users', users.list);
    describe('GET /api/admin/users/create', users.create);
    describe('POST /api/admin/users', users.store);
    describe('GET /api/admin/users/:userId', users.detail);
    describe('GET /api/admin/users/:userId/edit', users.edit);
    describe('PUT /api/admin/users/:userId', users.update);
    describe('DELETE /api/admin/users/:userId', users.destroy);

    // Locales
    const { locales } = admin;
    describe('GET /api/admin/locales', locales.list);
    describe('GET /api/admin/locales/create', locales.create);
    describe('POST /admin/locales', locales.store);
    describe('GET /api/admin/locales/:localeId', locales.detail);
    describe('GET /api/admin/locales/:localeId/edit', locales.edit);
    describe('PUT /api/admin/locales/:localeId', locales.update);
    describe('DELETE /api/admin/locales/:localeId', locales.destroy);

    // Schemes
    const { schemes } = admin;
    describe('GET /api/admin/schemes', schemes.list);
    describe('GET /api/admin/schemes/create', schemes.create);
    describe('POST /api/admin/schemes', schemes.store);
    describe('GET /api/admin/schemes/:schemeId', schemes.detail);
    describe('GET /api/admin/schemes/:schemeId/edit', schemes.edit);
    describe('PUT /api/admin/schemes/:schemeId', schemes.update);
    describe('DELETE /api/admin/schemes/:schemeId', schemes.destroy);

    // Surveys
    const { surveys } = admin;
    describe('GET /api/admin/surveys', surveys.list);
    describe('GET /api/admin/surveys/create', surveys.create);
    describe('POST /api/admin/surveys', surveys.store);
    describe('GET /api/admin/surveys/:surveyId', surveys.detail);
    describe('GET /api/admin/surveys/:surveyId/edit', surveys.edit);
    describe('PUT /api/admin/surveys/:surveyId', surveys.update);
    describe('DELETE /api/admin/surveys/:surveyId', surveys.destroy);

    // Surveys user management
    const { mgmt } = surveys;
    describe('GET /api/admin/surveys/:surveyId/mgmt', mgmt.list);
    describe('GET /api/admin/surveys/:surveyId/mgmt/available', mgmt.available);
    // describe('PUT /api/admin/surveys/:surveyId/mgmt/:userId', surveys.mgmt.update);

    // Surveys respondents
    // describe('GET /api/admin/surveys/:surveyId/respondents', surveys.respondents.list);
    // describe('POST /api/admin/surveys/:surveyId/respondents', surveys.respondents.store);
    // describe('PUT /api/admin/surveys/:surveyId/respondents/:userId', surveys.respondents.update);
    // describe('DELETE /api/admin/surveys/:surveyId/respondents/:userId', surveys.respondents.destroy);
  });
});
