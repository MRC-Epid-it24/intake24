import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import fsConfig from '@/config/filesystem';

export default (): void => {
  it('GET / should render when SPA app if deployed', async function () {
    const exists = fs.existsSync(path.resolve(fsConfig.local.public, 'survey', 'index.html'));

    const res = await request(this.app).get('/').set('Accept', 'application/json');

    expect(res.status).to.equal(exists ? 200 : 404);
  });

  it('GET /some-existing-route render when SPA app if deployed', async function () {
    const exists = fs.existsSync(path.resolve(fsConfig.local.public, 'survey', 'index.html'));

    const res = await request(this.app)
      .get('/some-existing-route')
      .set('Accept', 'application/json');

    expect(res.status).to.equal(exists ? 200 : 404);
  });
};
