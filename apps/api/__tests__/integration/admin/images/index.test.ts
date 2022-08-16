import fs from 'fs-extra';
import request from 'supertest';

import { suite } from '@intake24/api-tests/integration/helpers';

import asServed from './as-served/index.test';
import asServedImages from './as-served-images/index.test';
import guideImages from './guide-images/index.test';
import imageMaps from './image-maps/index.test';

export default () => {
  // As served sets
  describe('GET /api/admin/images/as-served-sets', asServed.browse);
  describe('POST /api/admin/images/as-served-sets', asServed.store);
  describe('GET /api/admin/images/as-served-sets/:asServedSetId', asServed.read);
  describe('GET /api/admin/images/as-served-sets/:asServedSetId/edit', asServed.edit);
  describe('PUT /api/admin/images/as-served-sets/:asServedSetId', asServed.update);
  describe('DELETE /api/admin/images/as-served-sets/:asServedSetId', asServed.destroy);

  // As served images
  describe('As served images', () => {
    beforeAll(async () => {
      await request(suite.app)
        .post('/api/admin/images/as-served-sets')
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

    describe('GET /api/admin/images/as-served-sets/:asServedSetId/images', asServedImages.browse);
    describe('POST /api/admin/images/as-served-sets/:asServedSetId/images', asServedImages.store);
    describe(
      'GET /api/admin/images/as-served-sets/:asServedSetId/images/:asServedImageId',
      asServedImages.read
    );
    describe(
      'DELETE /api/admin/images/as-served-sets/:asServedSetId/images/:asServedImageId',
      asServedImages.destroy
    );
  });

  // Drinkware sets - TODO
  /* describe('GET /api/admin/images/drinkware-sets', drinkwareSets.browse);
  describe('POST /api/admin/images/drinkware-sets', drinkwareSets.store);
  describe('GET /api/admin/images/drinkware-sets/refs', drinkwareSets.refs);
  describe('GET /api/admin/images/drinkware-sets/:drinkwareSetId', drinkwareSets.read);
  describe('GET /api/admin/images/drinkware-sets/:drinkwareSetId/edit', drinkwareSets.edit);
  describe('PUT /api/admin/images/drinkware-sets/:drinkwareSetId', drinkwareSets.update);
  describe('DELETE /api/admin/images/guide-images/:drinkwareSetId', drinkwareSets.destroy); */

  // Guided images
  describe('GET /api/admin/images/guide-images', guideImages.browse);
  describe('POST /api/admin/images/guide-images', guideImages.store);
  describe('GET /api/admin/images/guide-images/:guideImageId', guideImages.read);
  describe('GET /api/admin/images/guide-images/:guideImageId/edit', guideImages.edit);
  describe('PUT /api/admin/images/guide-images/:guideImageId', guideImages.update);
  describe('DELETE /api/admin/images/guide-images/:guideImageId', guideImages.destroy);

  // Image Maps
  describe('GET /api/admin/images/image-maps', imageMaps.browse);
  describe('POST /api/admin/images/image-maps', imageMaps.store);
  describe('GET /api/admin/images/image-maps/:imageMapId', imageMaps.read);
  describe('GET /api/admin/images/image-maps/:imageMapId/edit', imageMaps.edit);
  describe('PUT /api/admin/images/image-maps/:imageMapId', imageMaps.update);
  describe('DELETE /api/admin/images/image-maps/:imageMapId', imageMaps.destroy);
};
