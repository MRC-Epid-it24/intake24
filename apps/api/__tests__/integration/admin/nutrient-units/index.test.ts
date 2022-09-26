import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/nutrient-units', browse);
  describe('POST /api/admin/nutrient-units', store);
  describe('GET /api/admin/nutrient-units/:nutrientUnitId', read);
  describe('GET /api/admin/nutrient-units/:nutrientUnitId/edit', edit);
  describe('PUT /api/admin/nutrient-units/:nutrientUnitId', update);
  describe('DELETE /api/admin/nutrient-units/:nutrientUnitId', destroy);
};
