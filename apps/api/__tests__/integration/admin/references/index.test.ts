import asServedSets from './as-served-sets.test';
import categories from './categories.test';
import drinkwareSets from './drinkware-sets.test';
import feedbackSchemes from './feedback-schemes.test';
import foodGroups from './food-groups.test';
import foods from './foods.test';
import guideImages from './guide-images.test';
import imageMaps from './image-maps.test';
import languages from './languages.test';
import locales from './locales.test';
import nutrientTableRecords from './nutrient-table-records.test';
import nutrientTables from './nutrient-tables.test';
import nutrientTypes from './nutrient-types.test';
import standardUnits from './standard-units.test';
import surveySchemes from './survey-schemes.test';
import surveys from './surveys.test';

export default () => {
  describe('GET /api/admin/references/as-served-sets', asServedSets);
  describe('GET /api/admin/references/categories', categories);
  describe('GET /api/admin/references/drinkware-sets', drinkwareSets);
  describe('GET /api/admin/references/feedback-schemes', feedbackSchemes);
  describe('GET /api/admin/references/food-groups', foodGroups);
  describe('GET /api/admin/references/foods', foods);
  describe('GET /api/admin/references/guide-images', guideImages);
  describe('GET /api/admin/references/image-maps', imageMaps);
  describe('GET /api/admin/references/languages', languages);
  describe('GET /api/admin/references/locales', locales);
  describe('GET /api/admin/references/nutrient-tables', nutrientTables);
  describe(
    'GET /api/admin/references/nutrient-tables/:nutrientTableId/records',
    nutrientTableRecords
  );
  describe('GET /api/admin/references/nutrient-types', nutrientTypes);
  describe('GET /api/admin/references/standard-units', standardUnits);
  describe('GET /api/admin/references/survey-schemes', surveySchemes);
  describe('GET /api/admin/references/surveys', surveys);
};
