import browse from './browse.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/languages', browse);
  describe('POST /api/admin/languages', store);
  describe('GET /api/admin/languages/:languageId', read);
  describe('GET /api/admin/languages/:languageId/edit', edit);
  describe('PUT /api/admin/languages/:languageId', update);
  describe('DELETE /api/admin/languages/:languageId', destroy);

  // describe('GET /api/admin/languages/:languageId/translations', getTranslations);
  // describe('POST /api/admin/languages/:languageId/translations', updateTranslations);
};
