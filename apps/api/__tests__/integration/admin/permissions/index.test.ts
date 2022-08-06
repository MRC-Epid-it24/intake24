import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/permissions', browse);
  describe('POST /api/admin/permissions', store);
  describe('GET /api/admin/permissions/:permissionId', read);
  describe('GET /api/admin/permissions/:permissionId/edit', edit);
  describe('PUT /api/admin/permissions/:permissionId', update);
  describe('DELETE /api/admin/permissions/:permissionId', destroy);
};
