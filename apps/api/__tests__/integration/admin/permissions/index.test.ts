import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import roles from './roles.test';
import store from './store.test';
import update from './update.test';
import users from './users.test';

export default () => {
  describe('get /api/admin/permissions', browse);
  describe('pOST /api/admin/permissions', store);
  describe('get /api/admin/permissions/:permissionId', read);
  describe('get /api/admin/permissions/:permissionId/edit', edit);
  describe('put /api/admin/permissions/:permissionId', update);
  describe('delete /api/admin/permissions/:permissionId', destroy);
  describe('get /api/admin/permissions/:permissionId/roles', roles);
  describe('get /api/admin/permissions/:permissionId/users', users);
};
