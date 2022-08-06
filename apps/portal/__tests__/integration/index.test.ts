import '../bootstrap';

import { suite } from './helpers';
import site from './site';

describe('API', () => {
  beforeAll(async () => {
    await suite.init();
  });

  describe('Site', site);
});
