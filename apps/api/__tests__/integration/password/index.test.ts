import request from './request.test';
import reset from './reset.test';

export default () => {
  describe('pOST /api/password', request);
  describe('pOST /api/password/reset', reset);
};
