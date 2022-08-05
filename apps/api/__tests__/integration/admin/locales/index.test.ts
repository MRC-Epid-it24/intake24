import browse from './browse.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';
import refs from './refs.test';
import tasks from './tasks.test';
import splitLists from './split-lists/index.test';
import splitWords from './split-words/index.test';
import synonymSets from './synonym-sets/index.test';

export default () => {
  describe('GET /api/admin/locales', browse);
  describe('POST /api/admin/locales', store);
  describe('GET /api/admin/locales/refs', refs);
  describe('GET /api/admin/locales/:localeId', read);
  describe('GET /api/admin/locales/:localeId/edit', edit);
  describe('PUT /api/admin/locales/:localeId', update);
  describe('DELETE /api/admin/locales/:localeId', destroy);

  describe('POST /api/admin/locales/:localeId/tasks', tasks);

  describe('GET /api/admin/locales/:localeId/split-lists', splitLists.get);
  describe('POST /api/admin/locales/:localeId/split-lists', splitLists.set);
  describe('GET /api/admin/locales/:localeId/split-words', splitWords.get);
  describe('POST /api/admin/locales/:localeId/split-words', splitWords.set);
  describe('GET /api/admin/locales/:localeId/synonym-sets', synonymSets.get);
  describe('POST /api/admin/locales/:localeId/synonym-sets', synonymSets.set);
};
