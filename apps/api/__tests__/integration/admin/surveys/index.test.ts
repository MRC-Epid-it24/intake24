import browse from './browse.test';
// import put from './put.test';
import destroy from './destroy.test';
import edit from './edit.test';
import patch from './patch.test';
import read from './read.test';
import respondents from './respondents/index.test';
import store from './store.test';
import submissions from './submissions/index.test';
import tasks from './tasks.test';

export default () => {
  describe('GET /api/admin/surveys', browse);
  describe('POST /api/admin/surveys', store);
  describe('GET /api/admin/surveys/:surveyId', read);
  describe('GET /api/admin/surveys/:surveyId/edit', edit);
  describe('PATCH /api/admin/surveys/:surveyId', patch);
  // describe('PUT /api/admin/surveys/:surveyId', put);
  describe('DELETE /api/admin/surveys/:surveyId', destroy);

  // Surveys respondents
  describe('GET /api/admin/surveys/:surveyId/respondents', respondents.browse);
  describe('POST /api/admin/surveys/:surveyId/respondents', respondents.store);
  describe('GET /api/admin/surveys/:surveyId/respondents/:surveyId', respondents.read);
  describe('GET /api/admin/surveys/:surveyId/respondents/:surveyId/edit', respondents.edit);
  describe('PATCH /api/admin/surveys/:surveyId/respondents/:userId', respondents.update);
  describe('DELETE /api/admin/surveys/:surveyId/respondents/:userId', respondents.destroy);
  describe('POST /api/admin/surveys/:surveyId/respondents/upload', respondents.upload);
  describe(
    'POST /api/admin/surveys/:surveyId/respondents/export-auth-urls',
    respondents.exportAuthUrls
  );
  // describe('GET /api/admin/surveys/:surveyId/respondents/:userId', downloadFeedback);
  // describe('POST /api/admin/surveys/:surveyId/respondents/:userId', emailFeedback);

  // Surveys submissions
  describe('GET /api/admin/surveys/:surveyId/submissions', submissions.browse);
  describe('GET /api/admin/surveys/:surveyId/submissions/:submissionId', submissions.read);
  describe('DELETE /api/admin/surveys/:surveyId/submissions/:submissionId', submissions.destroy);

  // Surveys tasks
  describe('POST /api/admin/surveys/:surveyId/tasks', tasks);
};
