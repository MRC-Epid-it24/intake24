import browse from './browse.test';
import read from './read.test';
import refs from './refs.test';

export default () => {
  describe('GET /api/admin/fdbs', browse);
  describe('GET /api/admin/fdbs/:localeId', read);
  describe('GET /api/admin/fdbs/refs', refs);

  /*
  TODO: Implement tests for foods & categories

  describe('GET /api/admin/fdbs/:localeId/categories', categories.browse);
  describe('POST /api/admin/fdbs/:localeId/categories', categories.store);
  describe('GET /api/admin/fdbs/:localeId/categories', categories.root);
  describe('GET /api/admin/fdbs/:localeId/categories/:categoryId', categories.read);
  describe('PUT /api/admin/fdbs/:localeId/categories/:categoryId', categories.update);
  describe('DELETE /api/admin/fdbs/:localeId/categories/:categoryId', categories.destroy);
  describe('GET /api/admin/fdbs/:localeId/categories/:categoryId/contents', categories.contents);

  describe('GET /api/admin/fdbs/:localeId/foods', foods.browse);
  describe('POST /api/admin/fdbs/:localeId/foods', foods.store);
  describe('GET /api/admin/fdbs/:localeId/foods/:foodId', foods.read);
  describe('PUT /api/admin/fdbs/:localeId/foods/:foodId', foods.update);
  describe('DELETE /api/admin/fdbs/:localeId/foods/:foodId', foods.destroy);
  */
};
