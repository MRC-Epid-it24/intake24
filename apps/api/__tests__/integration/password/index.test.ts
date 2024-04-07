import request from './request.test';
import reset from './reset.test';

export default () => {
  describe('post /api/password', request);
  describe('post /api/password/reset', reset);
};
