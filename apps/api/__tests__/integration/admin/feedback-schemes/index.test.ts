import browse from './browse.test';
import copy from './copy.test';
import destroy from './destroy.test';
import edit from './edit.test';
import patch from './patch.test';
import read from './read.test';
import refs from './refs.test';
import store from './store.test';

export default () => {
  describe('get /api/admin/feedback-schemes', browse);
  describe('post /api/admin/feedback-schemes', store);
  describe('get /api/admin/feedback-schemes/refs', refs);
  describe('get /api/admin/feedback-schemes/:feedbackSchemeId', read);
  describe('get /api/admin/feedback-schemes/:feedbackSchemeId/edit', edit);
  describe('patch /api/admin/feedback-schemes/:feedbackSchemeId', patch);
  describe('delete /api/admin/feedback-schemes/:feedbackSchemeId', destroy);
  describe('post /api/admin/feedback-schemes/:feedbackSchemeId/copy', copy);
};
