import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/users', browse);
  describe('POST /api/admin/users', store);
  describe('GET /api/admin/users/refs', refs);
  describe('GET /api/admin/users/:userId', read);
  describe('GET /api/admin/users/:userId/edit', edit);
  describe('PUT /api/admin/users/:userId', update);
  describe('DELETE /api/admin/users/:userId', destroy);
};
