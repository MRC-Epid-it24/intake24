import browse from './browse.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/food-groups', browse);
  describe('POST /api/admin/food-groups', store);
  describe('GET /api/admin/food-groups/:foodGroupId', read);
  describe('GET /api/admin/food-groups/:foodGroupId/edit', edit);
  describe('PUT /api/admin/food-groups/:foodGroupId', update);
  describe('DELETE /api/admin/food-groups/:foodGroupId', destroy);
};
