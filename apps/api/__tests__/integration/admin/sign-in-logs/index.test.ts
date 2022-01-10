import browse from './browse.test';
import read from './read.test';
import destroy from './destroy.test';

export default () => {
  describe('GET /api/admin/sign-in-logs', browse);
  describe('GET /api/admin/sign-in-logs/:signInLogId', read);
  describe('DELETE /api/admin/sign-in-logs/:signInLogId', destroy);
};
