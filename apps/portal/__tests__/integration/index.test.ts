import '../bootstrap';

import { suite } from './helpers';
import site from './site';

describe('aPI', () => {
  beforeAll(async () => {
    await suite.init();
  });

  describe('site', site);
});
