import login from './login.test';
import logout from './logout.test';
import refresh from './refresh.test';

export default () => {
  describe('post /api/admin/auth/login', login);
  // describe('POST /api/admin/auth/duo', verify);
  // describe('POST /api/admin/auth/fido', verify);
  // describe('POST /api/admin/auth/otp', verify);
  describe('post /api/admin/auth/refresh', refresh);
  describe('post /api/admin/auth/logout', logout);
};
