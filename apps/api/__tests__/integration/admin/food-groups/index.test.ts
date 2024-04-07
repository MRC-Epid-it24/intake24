import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/food-groups', browse);
  describe('pOST /api/admin/food-groups', store);
  describe('get /api/admin/food-groups/:foodGroupId', read);
  describe('get /api/admin/food-groups/:foodGroupId/edit', edit);
  describe('put /api/admin/food-groups/:foodGroupId', update);
  describe('delete /api/admin/food-groups/:foodGroupId', destroy);
};
