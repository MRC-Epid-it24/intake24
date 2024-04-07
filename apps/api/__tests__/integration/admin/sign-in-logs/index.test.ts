import browse from './browse.test';
import destroy from './destroy.test';
import read from './read.test';

export default () => {
  describe('get /api/admin/sign-in-logs', browse);
  describe('get /api/admin/sign-in-logs/:signInLogId', read);
  describe('delete /api/admin/sign-in-logs/:signInLogId', destroy);
};
