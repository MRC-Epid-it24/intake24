import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/permissions', browse);
  describe('GET /api/admin/permissions/create', create);
  describe('POST /api/admin/permissions', store);
  describe('GET /api/admin/permissions/:permissionId', read);
  describe('GET /api/admin/permissions/:permissionId/edit', edit);
  describe('PUT /api/admin/permissions/:permissionId', update);
  describe('DELETE /api/admin/permissions/:permissionId', destroy);
};
