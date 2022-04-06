import browse from './browse.test';
import store from './store.test';
import read from './read.test';
import patch from './patch.test';
import destroy from './destroy.test';
import refs from './refs.test';
import copy from './copy.test';

export default () => {
  describe('GET /api/admin/feedback-schemes', browse);
  describe('POST /api/admin/feedback-schemes', store);
  describe('GET /api/admin/feedback-schemes/refs', refs);
  describe('POST /api/admin/feedback-schemes/copy', copy);
  describe('GET /api/admin/feedback-schemes/:feedbackSchemeId', read);
  describe('PATCH /api/admin/feedback-schemes/:feedbackSchemeId', patch);
  describe('DELETE /api/admin/feedback-schemes/:feedbackSchemeId', destroy);
};
