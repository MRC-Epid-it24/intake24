import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/roles', browse);
  describe('GET /api/admin/roles/create', create);
  describe('POST /api/admin/roles', store);
  describe('GET /api/admin/roles/:roleId', read);
  describe('GET /api/admin/roles/:roleId/edit', edit);
  describe('PUT /api/admin/roles/:roleId', update);
  describe('DELETE /api/admin/roles/:roleId', destroy);
};
