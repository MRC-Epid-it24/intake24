import asServedSets from './as-served-sets.test';
import drinkwareSets from './drinkware-sets.test';
import feedbackSchemes from './feedback-schemes.test';
import guideImages from './guide-images.test';
import imageMaps from './image-maps.test';
import languages from './languages.test';
import locales from './locales.test';
import nutrientTables from './nutrient-tables.test';
import standardUnits from './standard-units.test';
import surveySchemes from './survey-schemes.test';

export default () => {
  describe('GET /api/admin/references/as-served-sets', asServedSets);
  describe('GET /api/admin/references/drinkware-sets', drinkwareSets);
  describe('GET /api/admin/references/feedback-schemes', feedbackSchemes);
  describe('GET /api/admin/references/guide-images', guideImages);
  describe('GET /api/admin/references/image-maps', imageMaps);
  describe('GET /api/admin/references/languages', languages);
  describe('GET /api/admin/references/locales', locales);
  describe('GET /api/admin/references/nutrient-tables', nutrientTables);
  describe('GET /api/admin/references/standard-units', standardUnits);
  describe('GET /api/admin/references/survey-schemes', surveySchemes);
};