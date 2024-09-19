import browse from './browse.test';
import destroy from './destroy.test';
import read from './read.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/nutrient-units', browse);
  describe('post /api/admin/nutrient-units', store);
  describe('get /api/admin/nutrient-units/:nutrientUnitId', read);
  describe('put /api/admin/nutrient-units/:nutrientUnitId', update);
  describe('delete /api/admin/nutrient-units/:nutrientUnitId', destroy);
};
