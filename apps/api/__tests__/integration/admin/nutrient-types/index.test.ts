import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/nutrient-types', browse);
  describe('post /api/admin/nutrient-types', store);
  describe('get /api/admin/nutrient-types/refs', refs);
  describe('get /api/admin/nutrient-types/:nutrientTypeId', read);
  describe('get /api/admin/nutrient-types/:nutrientTypeId/edit', edit);
  describe('put /api/admin/nutrient-types/:nutrientTypeId', update);
  describe('delete /api/admin/nutrient-types/:nutrientTypeId', destroy);
};
