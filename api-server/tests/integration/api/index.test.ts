import '../../bootstrap';
import app from '@/app';
import { prepare, cleanup } from './mocks/setup.mock';
import root from './root.test';
import authentication from './authentication/index.test';

describe('API', function () {
  before(async function () {
    this.app = await app();
    this.data = await prepare();
  });

  after(async function () {
    await cleanup();
  });

  describe('Root', root);

  describe('Authentication', function () {
    describe('POST /login', authentication.login);
    describe('POST /login/alias', authentication.loginAlias);
    describe('POST /login/token', authentication.loginToken);
  });
});
