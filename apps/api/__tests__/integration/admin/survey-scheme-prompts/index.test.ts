import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import sync from './sync.test';
import update from './update.test';

export default () => {
  describe('GET /api/admin/survey-scheme-prompts', browse);
  describe('POST /api/admin/survey-scheme-prompts', store);
  describe('GET /api/admin/survey-scheme-prompts/refs', refs);
  describe('GET /api/admin/survey-scheme-prompts/:surveySchemePromptId', read);
  describe('GET /api/admin/survey-scheme-prompts/:surveySchemePromptId/edit', edit);
  describe('PUT /api/admin/survey-scheme-prompts/:surveySchemePromptId', update);
  describe('DELETE /api/admin/survey-scheme-prompts/:surveySchemePromptId', destroy);
  describe('POST /api/admin/survey-scheme-prompts/:surveySchemePromptId/sync', sync);
};
