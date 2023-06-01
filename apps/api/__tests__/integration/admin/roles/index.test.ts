import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import permissions from './permissions.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import update from './update.test';
import users from './users.test';

export default () => {
  describe('GET /api/admin/roles', browse);
  describe('POST /api/admin/roles', store);
  describe('GET /api/admin/roles/refs', refs);
  describe('GET /api/admin/roles/:roleId', read);
  describe('GET /api/admin/roles/:roleId/edit', edit);
  describe('PUT /api/admin/roles/:roleId', update);
  describe('DELETE /api/admin/roles/:roleId', destroy);
  describe('GET /api/admin/roles/:roleId/permissions', permissions);
  describe('GET /api/admin/roles/:roleId/users', users);
};
