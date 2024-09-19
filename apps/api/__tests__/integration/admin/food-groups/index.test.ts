import browse from './browse.test';
import destroy from './destroy.test';
import read from './read.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/food-groups', browse);
  describe('post /api/admin/food-groups', store);
  describe('get /api/admin/food-groups/:foodGroupId', read);
  describe('put /api/admin/food-groups/:foodGroupId', update);
  describe('delete /api/admin/food-groups/:foodGroupId', destroy);
};
