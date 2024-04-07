import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/nutrient-units', browse);
  describe('post /api/admin/nutrient-units', store);
  describe('get /api/admin/nutrient-units/:nutrientUnitId', read);
  describe('get /api/admin/nutrient-units/:nutrientUnitId/edit', edit);
  describe('put /api/admin/nutrient-units/:nutrientUnitId', update);
  describe('delete /api/admin/nutrient-units/:nutrientUnitId', destroy);
};
