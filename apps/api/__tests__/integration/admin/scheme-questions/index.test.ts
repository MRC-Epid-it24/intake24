import browse from './browse.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';
import sync from './sync.test';
import refs from './refs.test';

export default () => {
  describe('GET /api/admin/scheme-questions', browse);
  describe('POST /api/admin/scheme-questions', store);
  describe('GET /api/admin/scheme-questions/refs', refs);
  describe('GET /api/admin/scheme-questions/:schemeQuestionId', read);
  describe('GET /api/admin/scheme-questions/:schemeQuestionId/edit', edit);
  describe('PUT /api/admin/scheme-questions/:schemeQuestionId', update);
  describe('DELETE /api/admin/scheme-questions/:schemeQuestionId', destroy);
  describe('POST /api/admin/scheme-questions/:schemeQuestionId/sync', sync);
};
