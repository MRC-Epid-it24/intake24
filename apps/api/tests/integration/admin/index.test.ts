import fs from 'fs-extra';
import request from 'supertest';
import { suite } from '@tests/integration/helpers';

import user from './user/index.test';
import images from './images/index.test';
import jobs from './jobs/index.test';
import languages from './languages/index.test';
import locales from './locales/index.test';
import nutrientTables from './nutrient-tables/index.test';
import permissions from './permissions/index.test';
import roles from './roles/index.test';
import users from './users/index.test';
import schemes from './schemes/index.test';
import schemeQuestions from './scheme-questions/index.test';
import signInLogs from './sign-in-logs/index.test';
import surveys from './surveys/index.test';
import tasks from './tasks/index.test';

export default (): void => {
  // User profile
  describe('GET /api/admin/user', user.profile);

  // User jobs
  describe('GET /api/admin/user/jobs', user.jobs.browse);
  describe('GET /api/admin/user/jobs/:jobId', user.jobs.read);
  describe('GET /api/admin/user/jobs/:jobId/download', user.jobs.download);

  // As served sets
  const { asServed } = images;
  describe('GET /api/admin/images/as-served', asServed.browse);
  describe('GET /api/admin/images/as-served/create', asServed.create);
  describe('POST /api/admin/images/as-served', asServed.store);
  describe('GET /api/admin/images/as-served/:asServedSetId', asServed.read);
  describe('GET /api/admin/images/as-served/:asServedSetId/edit', asServed.edit);
  describe('PUT /api/admin/images/as-served/:asServedSetId', asServed.update);
  describe('DELETE /api/admin/images/as-served/:asServedSetId', asServed.destroy);

  // As served images
  describe('As served images', () => {
    beforeAll(async () => {
      await request(suite.app)
        .post('/api/admin/images/as-served')
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.superuser)
        .field('id', 'asServedSetForImages')
        .field('description', 'asServedSetForImages')
        .attach(
          'selectionImage',
          fs.createReadStream(suite.files.images.jpg),
          'asServedSetForImages.jpg'
        );
    });

    const { asServedImages } = images;
    describe('GET /api/admin/images/as-served/:asServedSetId/images', asServedImages.browse);
    describe('POST /api/admin/images/as-served/:asServedSetId/images', asServedImages.store);
    describe(
      'GET /api/admin/images/as-served/:asServedSetId/images/:asServedImageId',
      asServedImages.read
    );
    describe(
      'DELETE /api/admin/images/as-served/:asServedSetId/images/:asServedImageId',
      asServedImages.destroy
    );
  });

  // Guided images
  const { guides } = images;
  describe('GET /api/admin/images/guides', guides.browse);
  describe('GET /api/admin/images/guides/create', guides.create);
  describe('POST /api/admin/images/guides', guides.store);
  describe('GET /api/admin/images/guides/:guideImageId', guides.read);
  describe('GET /api/admin/images/guides/:guideImageId/edit', guides.edit);
  describe('PUT /api/admin/images/guides/:guideImageId', guides.update);
  describe('DELETE /api/admin/images/guides/:guideImageId', guides.destroy);

  // Image Maps
  const { maps } = images;
  describe('GET /api/admin/images/maps', maps.browse);
  describe('GET /api/admin/images/maps/create', maps.create);
  describe('POST /api/admin/images/maps', maps.store);
  describe('GET /api/admin/images/maps/:imageMapId', maps.read);
  describe('GET /api/admin/images/maps/:imageMapId/edit', maps.edit);
  describe('PUT /api/admin/images/maps/:imageMapId', maps.update);
  describe('DELETE /api/admin/images/maps/:imageMapId', maps.destroy);

  // Jobs
  describe('GET /api/admin/jobs', jobs.browse);
  describe('GET /api/admin/jobs/:jobId', jobs.read);
  describe('GET /api/admin/jobs/:jobId/download', jobs.download);
  describe('DELETE /api/admin/jobs/:jobId', jobs.destroy);

  // Languages
  describe('GET /api/admin/languages', languages.browse);
  describe('GET /api/admin/languages/create', languages.create);
  describe('POST /api/admin/languages', languages.store);
  describe('GET /api/admin/languages/:languageId', languages.read);
  describe('GET /api/admin/languages/:languageId/edit', languages.edit);
  describe('PUT /api/admin/languages/:languageId', languages.update);
  describe('DELETE /api/admin/languages/:languageId', languages.destroy);

  // Locales
  describe('GET /api/admin/locales', locales.browse);
  describe('GET /api/admin/locales/create', locales.create);
  describe('POST /api/admin/locales', locales.store);
  describe('GET /api/admin/locales/:localeId', locales.read);
  describe('GET /api/admin/locales/:localeId/edit', locales.edit);
  describe('PUT /api/admin/locales/:localeId', locales.update);
  describe('DELETE /api/admin/locales/:localeId', locales.destroy);

  // Nutrient tables
  describe('GET /api/admin/nutrient-tables', nutrientTables.browse);
  describe('GET /api/admin/nutrient-tables/create', nutrientTables.create);
  describe('POST /api/admin/nutrient-tables', nutrientTables.store);
  describe('GET /api/admin/nutrient-tables/:nutrientTableId', nutrientTables.read);
  describe('GET /api/admin/nutrient-tables/:nutrientTableId/edit', nutrientTables.edit);
  describe('PUT /api/admin/nutrient-tables/:nutrientTableId', nutrientTables.update);
  describe('DELETE /api/admin/nutrient-tables/:nutrientTableId', nutrientTables.destroy);

  // Permissions
  describe('GET /api/admin/permissions', permissions.browse);
  describe('GET /api/admin/permissions/create', permissions.create);
  describe('POST /api/admin/permissions', permissions.store);
  describe('GET /api/admin/permissions/:permissionId', permissions.read);
  describe('GET /api/admin/permissions/:permissionId/edit', permissions.edit);
  describe('PUT /api/admin/permissions/:permissionId', permissions.update);
  describe('DELETE /api/admin/permissions/:permissionId', permissions.destroy);

  // Roles
  describe('GET /api/admin/roles', roles.browse);
  describe('GET /api/admin/roles/create', roles.create);
  describe('POST /api/admin/roles', roles.store);
  describe('GET /api/admin/roles/:roleId', roles.read);
  describe('GET /api/admin/roles/:roleId/edit', roles.edit);
  describe('PUT /api/admin/roles/:roleId', roles.update);
  describe('DELETE /api/admin/roles/:roleId', roles.destroy);

  // Schemes
  describe('GET /api/admin/schemes', schemes.browse);
  describe('GET /api/admin/schemes/create', schemes.create);
  describe('POST /api/admin/schemes', schemes.store);
  describe('POST /api/admin/schemes/copy', schemes.copy);
  describe('GET /api/admin/schemes/:schemeId', schemes.read);
  describe('GET /api/admin/schemes/:schemeId/edit', schemes.edit);
  describe('PUT /api/admin/schemes/:schemeId', schemes.update);
  describe('DELETE /api/admin/schemes/:schemeId', schemes.destroy);
  describe('GET /api/admin/schemes/:schemeId/templates', schemes.templates);
  describe('GET /api/admin/schemes/:schemeId/data-export', schemes.dataExport);

  // Scheme questions
  describe('GET /api/admin/scheme-questions', schemeQuestions.browse);
  describe('GET /api/admin/scheme-questions/create', schemeQuestions.create);
  describe('POST /api/admin/scheme-questions', schemeQuestions.store);
  describe('GET /api/admin/scheme-questions/:schemeQuestionId', schemeQuestions.read);
  describe('GET /api/admin/scheme-questions/:schemeQuestionId/edit', schemeQuestions.edit);
  describe('PUT /api/admin/scheme-questions/:schemeQuestionId', schemeQuestions.update);
  describe('DELETE /api/admin/scheme-questions/:schemeQuestionId', schemeQuestions.destroy);
  describe('POST /api/admin/scheme-questions/:schemeQuestionId/sync', schemeQuestions.sync);

  // Sign-in logs
  describe('GET /api/admin/sign-in-logs', signInLogs.browse);
  describe('GET /api/admin/sign-in-logs/:signInLogId', signInLogs.read);
  describe('DELETE /api/admin/sign-in-logs/:signInLogId', signInLogs.destroy);

  // Surveys
  describe('GET /api/admin/surveys', surveys.browse);
  describe('GET /api/admin/surveys/create', surveys.create);
  describe('POST /api/admin/surveys', surveys.store);
  describe('GET /api/admin/surveys/:surveyId', surveys.read);
  describe('GET /api/admin/surveys/:surveyId/edit', surveys.edit);
  describe('PUT /api/admin/surveys/:surveyId', surveys.update);
  describe('DELETE /api/admin/surveys/:surveyId', surveys.destroy);

  // Surveys user management
  const { mgmt } = surveys;
  describe('GET /api/admin/surveys/:surveyId/mgmt', mgmt.browse);
  describe('POST /api/admin/surveys/:surveyId/mgmt', mgmt.store);
  describe('GET /api/admin/surveys/:surveyId/mgmt/permissions', mgmt.availablePermissions);
  describe('GET /api/admin/surveys/:surveyId/mgmt/users', mgmt.availableUsers);
  describe('PATCH /api/admin/surveys/:surveyId/mgmt/:userId', mgmt.update);

  // Surveys respondents
  // describe('GET /api/admin/surveys/:surveyId/respondents', surveys.respondents.browse);
  // describe('POST /api/admin/surveys/:surveyId/respondents', surveys.respondents.store);
  // describe('POST /api/admin/surveys/:surveyId/upload', surveys.respondents.upload);
  // describe('POST /api/admin/surveys/:surveyId/export-auth-urls', surveys.respondents.exportAuthUrls);
  // describe('PUT /api/admin/surveys/:surveyId/respondents/:userId', surveys.respondents.update);
  // describe('DELETE /api/admin/surveys/:surveyId/respondents/:userId', surveys.respondents.destroy);

  // Surveys submissions
  // describe('GET /api/admin/surveys/:surveyId/submissions', surveys.respondents.submissions.browse);
  // describe('GET /api/admin/surveys/:surveyId/submissions/:submissionId', surveys.respondents.submissions.read);
  // describe('DELETE /api/admin/surveys/:surveyId/submissions/:submissionId', surveys.respondents.submissions.destroy);

  // Surveys data-export
  const { dataExport } = surveys;
  describe('POST /api/admin/surveys/:surveyId/data-export', dataExport.queue);
  describe('POST /api/admin/surveys/:surveyId/data-export/sync', dataExport.sync);

  // Tasks
  describe('GET /api/admin/tasks', tasks.browse);
  describe('GET /api/admin/tasks/create', tasks.create);
  describe('POST /api/admin/tasks', tasks.store);
  describe('GET /api/admin/tasks/:taskId', tasks.read);
  describe('GET /api/admin/tasks/:taskId/edit', tasks.edit);
  describe('PUT /api/admin/tasks/:taskId', tasks.update);
  describe('DELETE /api/admin/tasks/:taskId', tasks.destroy);
  describe('POST /api/admin/tasks/:taskId/run', tasks.run);

  // Users
  describe('GET /api/admin/users', users.browse);
  describe('GET /api/admin/users/create', users.create);
  describe('POST /api/admin/users', users.store);
  describe('GET /api/admin/users/:userId', users.read);
  describe('GET /api/admin/users/:userId/edit', users.edit);
  describe('PUT /api/admin/users/:userId', users.update);
  describe('DELETE /api/admin/users/:userId', users.destroy);
};
