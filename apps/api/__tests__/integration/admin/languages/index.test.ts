import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import store from './store.test';
import translations from './translations/index.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/languages', browse);
  describe('POST /api/admin/languages', store);
  describe('GET /api/admin/languages/:languageId', read);
  describe('GET /api/admin/languages/:languageId/edit', edit);
  describe('PUT /api/admin/languages/:languageId', update);
  describe('DELETE /api/admin/languages/:languageId', destroy);

  describe('GET /api/admin/languages/:languageId/translations', translations.browse);
  describe('POST /api/admin/languages/:languageId/translations', translations.store);
  describe('PUT /api/admin/languages/:languageId/translations', translations.update);
  describe('DELETE /api/admin/languages/:languageId/translations', translations.destroy);
  // describe('POST /api/admin/languages/:languageId/translations/sync', translations.sync);
};
