import browse from './browse.test';
import destroy from './destroy.test';
import edit from './edit.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';
import sync from './sync.test';
import update from './update.test';

export default () => {
  describe('get /api/admin/survey-scheme-prompts', browse);
  describe('post /api/admin/survey-scheme-prompts', store);
  describe('get /api/admin/survey-scheme-prompts/refs', refs);
  describe('get /api/admin/survey-scheme-prompts/:surveySchemePromptId', read);
  describe('get /api/admin/survey-scheme-prompts/:surveySchemePromptId/edit', edit);
  describe('put /api/admin/survey-scheme-prompts/:surveySchemePromptId', update);
  describe('delete /api/admin/survey-scheme-prompts/:surveySchemePromptId', destroy);
  describe('post /api/admin/survey-scheme-prompts/:surveySchemePromptId/sync', sync);
};
