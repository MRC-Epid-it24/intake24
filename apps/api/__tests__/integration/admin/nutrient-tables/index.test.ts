import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import tasks from './tasks.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/nutrient-tables', browse);
  describe('post /api/admin/nutrient-tables', store);
  describe('get /api/admin/nutrient-tables/refs', refs);
  describe('get /api/admin/nutrient-tables/:nutrientTableId', read);
  describe('get /api/admin/nutrient-tables/:nutrientTableId/edit', edit);
  describe('put /api/admin/nutrient-tables/:nutrientTableId', update);
  describe('delete /api/admin/nutrient-tables/:nutrientTableId', destroy);
  describe('post /api/admin/nutrient-tables/:nutrientTableId/tasks', tasks);
};
