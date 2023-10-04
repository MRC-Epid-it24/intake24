import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import tasks from './tasks.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/nutrient-tables', browse);
  describe('POST /api/admin/nutrient-tables', store);
  describe('GET /api/admin/nutrient-tables/refs', refs);
  describe('GET /api/admin/nutrient-tables/:nutrientTableId', read);
  describe('GET /api/admin/nutrient-tables/:nutrientTableId/edit', edit);
  describe('PUT /api/admin/nutrient-tables/:nutrientTableId', update);
  describe('DELETE /api/admin/nutrient-tables/:nutrientTableId', destroy);
  describe('POST /api/admin/nutrient-tables/:nutrientTableId/tasks', tasks);
};
