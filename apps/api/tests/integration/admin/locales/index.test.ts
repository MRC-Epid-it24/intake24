import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/locales', browse);
  describe('GET /api/admin/locales/create', create);
  describe('POST /api/admin/locales', store);
  describe('GET /api/admin/locales/:localeId', read);
  describe('GET /api/admin/locales/:localeId/edit', edit);
  describe('PUT /api/admin/locales/:localeId', update);
  describe('DELETE /api/admin/locales/:localeId', destroy);
};
