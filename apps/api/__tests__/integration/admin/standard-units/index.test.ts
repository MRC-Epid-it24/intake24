import browse from './browse.test';
import categories from './categories.test';
import destroy from './destroy.test';
import edit from './edit.test';
import foods from './foods.test';
import read from './read.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/standard-units', browse);
  describe('post /api/admin/standard-units', store);
  describe('get /api/admin/standard-units/:standardUnitId', read);
  describe('get /api/admin/standard-units/:standardUnitId/edit', edit);
  describe('put /api/admin/standard-units/:standardUnitId', update);
  describe('delete /api/admin/standard-units/:standardUnitId', destroy);
  describe('get /api/admin/standard-units/:standardUnitId/categories', categories);
  describe('get /api/admin/standard-units/:standardUnitId/foods', foods);
};
