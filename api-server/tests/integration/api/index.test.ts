import '../../bootstrap';
import app from '@/app';
import root from './root.test';
import authentication from './authentication/index.test';

describe('API', function () {
  before(async function () {
    this.app = await app();
  });

  describe('Root', root);

  describe('Authentication', function () {
    describe('POST /login', authentication.login);
    describe('POST /login/alias', authentication.loginAlias);
    describe('POST /login/token', authentication.loginToken);
  });
});
