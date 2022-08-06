import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import sync from './sync.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/survey-scheme-questions', browse);
  describe('POST /api/admin/survey-scheme-questions', store);
  describe('GET /api/admin/survey-scheme-questions/refs', refs);
  describe('GET /api/admin/survey-scheme-questions/:surveySchemeQuestionId', read);
  describe('GET /api/admin/survey-scheme-questions/:surveySchemeQuestionId/edit', edit);
  describe('PUT /api/admin/survey-scheme-questions/:surveySchemeQuestionId', update);
  describe('DELETE /api/admin/survey-scheme-questions/:surveySchemeQuestionId', destroy);
  describe('POST /api/admin/survey-scheme-questions/:surveySchemeQuestionId/sync', sync);
};
