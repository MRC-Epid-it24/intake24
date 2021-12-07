import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/users', browse);
  describe('GET /api/admin/users/create', create);
  describe('POST /api/admin/users', store);
  describe('GET /api/admin/users/:userId', read);
  describe('GET /api/admin/users/:userId/edit', edit);
  describe('PUT /api/admin/users/:userId', update);
  describe('DELETE /api/admin/users/:userId', destroy);
};
