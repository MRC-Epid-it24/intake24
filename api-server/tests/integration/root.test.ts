import fs from 'fs';
import path from 'path';
import request from 'supertest';
import { suite } from '@tests/integration/helpers';
import fsConfig from '@/config/filesystem';

export default (): void => {
  it('GET / should render when SPA app if deployed', async () => {
    const exists = fs.existsSync(path.resolve(fsConfig.local.public, 'survey', 'index.html'));

    const res = await request(suite.app).get('/').set('Accept', 'application/json');

    expect(res.status).toBe(exists ? 200 : 404);
  });

  it('GET /some-existing-route render when SPA app if deployed', async () => {
    const exists = fs.existsSync(path.resolve(fsConfig.local.public, 'survey', 'index.html'));

    const res = await request(suite.app)
      .get('/some-existing-route')
      .set('Accept', 'application/json');

    expect(res.status).toBe(exists ? 200 : 404);
  });
};
