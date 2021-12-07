import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/nutrient-tables', browse);
  describe('GET /api/admin/nutrient-tables/create', create);
  describe('POST /api/admin/nutrient-tables', store);
  describe('GET /api/admin/nutrient-tables/:nutrientTableId', read);
  describe('GET /api/admin/nutrient-tables/:nutrientTableId/edit', edit);
  describe('PUT /api/admin/nutrient-tables/:nutrientTableId', update);
  describe('DELETE /api/admin/nutrient-tables/:nutrientTableId', destroy);
};
