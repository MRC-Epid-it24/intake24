import login from './login.test';
import loginAlias from './login-alias.test';
import loginToken from './login-token.test';
import logout from './logout.test';
import refresh from './refresh.test';

export default () => {
  describe('pOST /api/auth/login', login);
  describe('pOST /api/auth/login/alias', loginAlias);
  describe('pOST /api/auth/login/token', loginToken);
  describe('pOST /api/auth/login/refresh', refresh);
  describe('pOST /api/auth/login/logout', logout);
};
