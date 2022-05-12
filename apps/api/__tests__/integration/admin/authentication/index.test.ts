import login from './login.test';
import refresh from './refresh.test';
import logout from './logout.test';

export default () => {
  describe('POST /api/admin/auth/login', login);
  // describe('POST /api/admin/auth/verify', verify);
  describe('POST /api/admin/auth/refresh', refresh);
  describe('POST /api/admin/auth/logout', logout);
};