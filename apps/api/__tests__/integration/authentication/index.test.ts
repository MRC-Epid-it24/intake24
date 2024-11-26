import loginAlias from './login-alias.test';
import loginToken from './login-token.test';
import login from './login.test';
import logout from './logout.test';
import refresh from './refresh.test';

export default () => {
  describe('post /api/auth/login', login);
  describe('post /api/auth/login/alias', loginAlias);
  describe('post /api/auth/login/token', loginToken);
  describe('post /api/auth/login/refresh', refresh);
  describe('post /api/auth/login/logout', logout);
};
