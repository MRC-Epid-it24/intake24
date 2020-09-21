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
    describe('POST /login', authentication.login);
    describe('POST /login/alias', authentication.loginAlias);
    describe('POST /login/token', authentication.loginToken);
  });

  describe('Admin', function () {
    before(async function () {
      const res = await request(this.app)
        .post('/login')
        .set('Accept', 'application/json')
        .send({ email: 'testUser@example.com', password: 'testUserPassword' });

      this.bearer = `Bearer ${res.body.accessToken}`;
    });

    describe('GET /admin/profile', admin.profile);

    // Permissions
    const { permissions } = admin;
    describe('GET /admin/permissions', permissions.list);
    describe('GET /admin/permissions/create', permissions.create);
    describe('POST /admin/permissions', permissions.store);
    describe('GET /admin/permissions/:permissionId', permissions.detail);
    describe('GET /admin/permissions/:permissionId/edit', permissions.edit);
    describe('PUT /admin/permissions/:permissionId', permissions.update);
    describe('DELETE /admin/permissions/:permissionId', permissions.destroy);

    // Roles
    const { roles } = admin;
    describe('GET /admin/roles', roles.list);
    describe('GET /admin/roles/create', roles.create);
    describe('POST /admin/roles', roles.store);
    describe('GET /admin/roles/:roleId', roles.detail);
    describe('GET /admin/roles/:roleId/edit', roles.edit);
    describe('PUT /admin/roles/:roleId', roles.update);
    describe('DELETE /admin/roles/:roleId', roles.destroy);

    // Users
    const { users } = admin;
    describe('GET /admin/users', users.list);
    describe('GET /admin/users/create', users.create);
    describe('POST /admin/users', users.store);
    describe('GET /admin/users/:userId', users.detail);
    describe('GET /admin/users/:userId/edit', users.edit);
    describe('PUT /admin/users/:userId', users.update);
    describe('DELETE /admin/users/:userId', users.destroy);

    // Surveys
    const { surveys } = admin;
    describe('GET /admin/surveys', surveys.list);
    describe('GET /admin/surveys/create', surveys.create);
    describe('POST /admin/surveys', surveys.store);
    describe('GET /admin/surveys/:surveyId', surveys.detail);
    describe('GET /admin/surveys/:surveyId/edit', surveys.edit);
    describe('PUT /admin/surveys/:surveyId', surveys.update);
    describe('DELETE /admin/surveys/:surveyId', surveys.destroy);
  });
});
