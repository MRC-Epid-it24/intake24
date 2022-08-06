import request from 'supertest';

import { suite } from '../helpers';

export default () => {
  const urls = [
    '/',
    '/contacts',
    '/features',
    '/feedback',
    '/open-source',
    '/output',
    '/publications',
    '/recall',
    '/validation',
    '/privacy',
    '/terms',
  ];

  it('should render all sites', async () => {
    for (const url of urls) {
      const { status } = await request(suite.app).get(url);

      expect(status).toBe(200);
    }
  });

  it('should return 404 for non-existing content', async () => {
    const url = '/non-existing-content';

    const { status } = await request(suite.app).get(url);

    expect(status).toBe(404);
  });
};
