import browse from './browse.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import patch from './patch.test';
import destroy from './destroy.test';
import refs from './refs.test';
import copy from './copy.test';
import dataExport from './data-export.test';
import templates from './templates.test';

export default () => {
  describe('GET /api/admin/survey-schemes', browse);
  describe('POST /api/admin/survey-schemes', store);
  describe('GET /api/admin/survey-schemes/refs', refs);
  describe('POST /api/admin/survey-schemes/copy', copy);
  describe('GET /api/admin/survey-schemes/:surveySchemeId', read);
  describe('GET /api/admin/survey-schemes/:surveySchemeId/edit', edit);
  describe('PATCH /api/admin/survey-schemes/:surveySchemeId', patch);
  describe('DELETE /api/admin/survey-schemes/:surveySchemeId', destroy);
  describe('GET /api/admin/survey-schemes/:surveySchemeId/templates', templates);
  describe('GET /api/admin/survey-schemes/:surveySchemeId/data-export', dataExport);
};
