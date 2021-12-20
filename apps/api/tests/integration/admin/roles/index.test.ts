import browse from './browse.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';
import refs from './refs.test';

export default () => {
  describe('GET /api/admin/roles', browse);
  describe('POST /api/admin/roles', store);
  describe('GET /api/admin/roles/refs', refs);
  describe('GET /api/admin/roles/:roleId', read);
  describe('GET /api/admin/roles/:roleId/edit', edit);
  describe('PUT /api/admin/roles/:roleId', update);
  describe('DELETE /api/admin/roles/:roleId', destroy);
};
