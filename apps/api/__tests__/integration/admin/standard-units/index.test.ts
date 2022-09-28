import browse from './browse.test';
import categories from './categories.test';
import destroy from './destroy.test';
import edit from './edit.test';
import foods from './foods.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/standard-units', browse);
  describe('POST /api/admin/standard-units', store);
  describe('GET /api/admin/standard-units/refs', refs);
  describe('GET /api/admin/standard-units/:standardUnitId', read);
  describe('GET /api/admin/standard-units/:standardUnitId/edit', edit);
  describe('PUT /api/admin/standard-units/:standardUnitId', update);
  describe('DELETE /api/admin/standard-units/:standardUnitId', destroy);
  describe('GET /api/admin/standard-units/:standardUnitId/categories', categories);
  describe('GET /api/admin/standard-units/:standardUnitId/foods', foods);
};
