import request from './request.test';
import reset from './reset.test';

export default () => {
  describe('POST /api/password', request);
  describe('POST /api/password/reset', reset);
};
