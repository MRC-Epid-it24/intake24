import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import patchAdmin from './patch-admin.test';
import patchStaff from './patch-staff.test';
import put from './put.test';
import destroy from './destroy.test';
import mgmt from './mgmt/index.test';
import dataExport from './data-export/index.test';
import respondents from './respondents/index.test';
import submissions from './submissions/index.test';

export default () => {
  describe('GET /api/admin/surveys', browse);
  describe('GET /api/admin/surveys/create', create);
  describe('POST /api/admin/surveys', store);
  describe('GET /api/admin/surveys/:surveyId', read);
  describe('GET /api/admin/surveys/:surveyId/edit', edit);
  describe('PATCH /api/admin/surveys/:surveyId', patchAdmin);
  describe('PATCH /api/admin/surveys/:surveyId', patchStaff);
  describe('PUT /api/admin/surveys/:surveyId', put);
  describe('DELETE /api/admin/surveys/:surveyId', destroy);

  // Surveys user management
  describe('GET /api/admin/surveys/:surveyId/mgmt', mgmt.browse);
  describe('POST /api/admin/surveys/:surveyId/mgmt', mgmt.store);
  describe('GET /api/admin/surveys/:surveyId/mgmt/permissions', mgmt.availablePermissions);
  describe('GET /api/admin/surveys/:surveyId/mgmt/users', mgmt.availableUsers);
  describe('PATCH /api/admin/surveys/:surveyId/mgmt/:userId', mgmt.update);

  // Surveys respondents
  describe('GET /api/admin/surveys/:surveyId/respondents', respondents.browse);
  describe('POST /api/admin/surveys/:surveyId/respondents', respondents.store);
  describe('GET /api/admin/surveys/:surveyId/respondents/:surveyId', respondents.read);
  describe('GET /api/admin/surveys/:surveyId/respondents/:surveyId/edit', respondents.edit);
  describe('PATCH /api/admin/surveys/:surveyId/respondents/:userId', respondents.update);
  describe('DELETE /api/admin/surveys/:surveyId/respondents/:userId', respondents.destroy);
  describe('POST /api/admin/surveys/:surveyId/upload', respondents.upload);
  describe('POST /api/admin/surveys/:surveyId/export-auth-urls', respondents.exportAuthUrls);

  // Surveys submissions
  describe('GET /api/admin/surveys/:surveyId/submissions', submissions.browse);
  describe('GET /api/admin/surveys/:surveyId/submissions/:submissionId', submissions.read);
  describe('DELETE /api/admin/surveys/:surveyId/submissions/:submissionId', submissions.destroy);

  // Surveys data-export
  describe('POST /api/admin/surveys/:surveyId/data-export', dataExport.queue);
  describe('POST /api/admin/surveys/:surveyId/data-export/sync', dataExport.sync);
};
