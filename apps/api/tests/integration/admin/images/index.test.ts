import fs from 'fs-extra';
import request from 'supertest';
import { suite } from '@tests/integration/helpers';
import asServed from './as-served/index.test';
import asServedImages from './as-served-images/index.test';
import guides from './guides/index.test';
import maps from './maps/index.test';

export default () => {
  // As served sets
  describe('GET /api/admin/images/as-served', asServed.browse);
  describe('POST /api/admin/images/as-served', asServed.store);
  describe('GET /api/admin/images/as-served/:asServedSetId', asServed.read);
  describe('GET /api/admin/images/as-served/:asServedSetId/edit', asServed.edit);
  describe('PUT /api/admin/images/as-served/:asServedSetId', asServed.update);
  describe('DELETE /api/admin/images/as-served/:asServedSetId', asServed.destroy);

  // As served images
  describe('As served images', () => {
    beforeAll(async () => {
      await request(suite.app)
        .post('/api/admin/images/as-served')
        .set('Accept', 'application/json')
        .set('Authorization', suite.bearer.superuser)
        .field('id', 'asServedSetForImages')
        .field('description', 'asServedSetForImages')
        .attach(
          'selectionImage',
          fs.createReadStream(suite.files.images.jpg),
          'asServedSetForImages.jpg'
        );
    });

    describe('GET /api/admin/images/as-served/:asServedSetId/images', asServedImages.browse);
    describe('POST /api/admin/images/as-served/:asServedSetId/images', asServedImages.store);
    describe(
      'GET /api/admin/images/as-served/:asServedSetId/images/:asServedImageId',
      asServedImages.read
    );
    describe(
      'DELETE /api/admin/images/as-served/:asServedSetId/images/:asServedImageId',
      asServedImages.destroy
    );
  });

  // Guided images
  describe('GET /api/admin/images/guides', guides.browse);
  describe('POST /api/admin/images/guides', guides.store);
  describe('GET /api/admin/images/guides/refs', guides.refs);
  describe('GET /api/admin/images/guides/:guideImageId', guides.read);
  describe('GET /api/admin/images/guides/:guideImageId/edit', guides.edit);
  describe('PUT /api/admin/images/guides/:guideImageId', guides.update);
  describe('DELETE /api/admin/images/guides/:guideImageId', guides.destroy);

  // Image Maps
  describe('GET /api/admin/images/maps', maps.browse);
  describe('POST /api/admin/images/maps', maps.store);
  describe('GET /api/admin/images/maps/:imageMapId', maps.read);
  describe('GET /api/admin/images/maps/:imageMapId/edit', maps.edit);
  describe('PUT /api/admin/images/maps/:imageMapId', maps.update);
  describe('DELETE /api/admin/images/maps/:imageMapId', maps.destroy);
};
