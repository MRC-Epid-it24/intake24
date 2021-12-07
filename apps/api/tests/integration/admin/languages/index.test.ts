import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/languages', browse);
  describe('GET /api/admin/languages/create', create);
  describe('POST /api/admin/languages', store);
  describe('GET /api/admin/languages/:languageId', read);
  describe('GET /api/admin/languages/:languageId/edit', edit);
  describe('PUT /api/admin/languages/:languageId', update);
  describe('DELETE /api/admin/languages/:languageId', destroy);
};
