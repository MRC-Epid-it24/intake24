import asServedSet from './as-served-set.test';
import asServedSets from './as-served-sets.test';
import drinkwareSet from './drinkware-set.test';
import drinkwareSets from './drinkware-sets.test';
import guideImage from './guide-image.test';
import guideImages from './guide-images.test';
import imageMap from './image-map.test';
import imageMaps from './image-maps.test';
import weight from './weight.test';

export default () => {
  describe('GET /api/portion-sizes/as-served-sets', asServedSets);
  describe('GET /api/portion-sizes/as-served-sets/:id', asServedSet);
  describe('GET /api/portion-sizes/drinkware-sets', drinkwareSets);
  describe('GET /api/portion-sizes/drinkware-sets/:id', drinkwareSet);
  describe('GET /api/portion-sizes/guide-images', guideImages);
  describe('GET /api/portion-sizes/guide-images/:id', guideImage);
  describe('GET /api/portion-sizes/image-maps', imageMaps);
  describe('GET /api/portion-sizes/image-maps/:id', imageMap);
  describe('GET /api/portion-sizes/weight', weight);
};
