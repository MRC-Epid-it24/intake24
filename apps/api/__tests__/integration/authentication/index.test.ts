import login from './login.test';
import loginAlias from './login-alias.test';
import loginToken from './login-token.test';
import refresh from './refresh.test';
import logout from './logout.test';

export default () => {
  describe('POST /api/auth/login', login);
  describe('POST /api/auth/login/alias', loginAlias);
  describe('POST /api/auth/login/token', loginToken);
  describe('POST /api/auth/login/refresh', refresh);
  describe('POST /api/auth/login/logout', logout);
};
