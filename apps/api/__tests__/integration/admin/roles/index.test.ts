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
  describe('get /api/admin/roles', browse);
  describe('post /api/admin/roles', store);
  describe('get /api/admin/roles/refs', refs);
  describe('get /api/admin/roles/:roleId', read);
  describe('get /api/admin/roles/:roleId/edit', edit);
  describe('put /api/admin/roles/:roleId', update);
  describe('delete /api/admin/roles/:roleId', destroy);
  describe('get /api/admin/roles/:roleId/permissions', permissions);
  describe('get /api/admin/roles/:roleId/users', users);
};
