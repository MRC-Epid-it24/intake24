import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';
import sync from './sync.test';

export default () => {
  describe('GET /api/admin/scheme-questions', browse);
  describe('GET /api/admin/scheme-questions/create', create);
  describe('POST /api/admin/scheme-questions', store);
  describe('GET /api/admin/scheme-questions/:schemeQuestionId', read);
  describe('GET /api/admin/scheme-questions/:schemeQuestionId/edit', edit);
  describe('PUT /api/admin/scheme-questions/:schemeQuestionId', update);
  describe('DELETE /api/admin/scheme-questions/:schemeQuestionId', destroy);
  describe('POST /api/admin/scheme-questions/:schemeQuestionId/sync', sync);
};
