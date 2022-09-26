import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/nutrient-types', browse);
  describe('POST /api/admin/nutrient-types', store);
  describe('GET /api/admin/nutrient-types/refs', refs);
  describe('GET /api/admin/nutrient-types/:nutrientTypeId', read);
  describe('GET /api/admin/nutrient-types/:nutrientTypeId/edit', edit);
  describe('PUT /api/admin/nutrient-types/:nutrientTypeId', update);
  describe('DELETE /api/admin/nutrient-types/:nutrientTypeId', destroy);
};
