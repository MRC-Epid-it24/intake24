import browse from './browse.test';
import create from './create.test';
import store from './store.test';
import read from './read.test';
import edit from './edit.test';
import update from './update.test';
import destroy from './destroy.test';
import copy from './copy.test';
import dataExport from './data-export.test';
import templates from './templates.test';

export default () => {
  describe('GET /api/admin/schemes', browse);
  describe('GET /api/admin/schemes/create', create);
  describe('POST /api/admin/schemes', store);
  describe('POST /api/admin/schemes/copy', copy);
  describe('GET /api/admin/schemes/:schemeId', read);
  describe('GET /api/admin/schemes/:schemeId/edit', edit);
  describe('PUT /api/admin/schemes/:schemeId', update);
  describe('DELETE /api/admin/schemes/:schemeId', destroy);
  describe('GET /api/admin/schemes/:schemeId/templates', templates);
  describe('GET /api/admin/schemes/:schemeId/data-export', dataExport);
};
