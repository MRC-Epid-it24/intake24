import { Router } from 'express';

import { anyPermission } from '@intake24/api/http/middleware';
import validation from '@intake24/api/http/requests/admin/references';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { referenceController } = ioc.cradle;
  const router = Router();

  router.get(
    '/as-served-sets',
    anyPermission(['locales']),
    validation.browse,
    wrapAsync(referenceController.asServedSets)
  );

  router.get(
    '/categories',
    anyPermission(['locales']),
    validation.browse,
    wrapAsync(referenceController.categories)
  );

  router.get(
    '/drinkware-sets',
    anyPermission(['locales']),
    validation.browse,
    wrapAsync(referenceController.drinkwareSets)
  );

  router.get(
    '/feedback-schemes',
    anyPermission(['feedback-schemes', 'surveys']),
    validation.browse,
    wrapAsync(referenceController.feedbackSchemes)
  );

  router.get(
    '/food-groups',
    anyPermission(['locales']),
    validation.browse,
    wrapAsync(referenceController.foodGroups)
  );

  router.get(
    '/foods',
    anyPermission(['locales']),
    validation.browse,
    wrapAsync(referenceController.foods)
  );

  router.get(
    '/guide-images',
    anyPermission(['locales']),
    validation.browse,
    wrapAsync(referenceController.guideImages)
  );

  router.get(
    '/image-maps',
    anyPermission(['locales', 'guide-images']),
    validation.browse,
    wrapAsync(referenceController.imageMaps)
  );

  router.get(
    '/languages',
    anyPermission(['locales', 'feedback-schemes', 'survey-schemes']),
    validation.browse,
    wrapAsync(referenceController.languages)
  );

  router.get(
    '/locales',
    anyPermission(['surveys', 'tasks']),
    validation.browse,
    wrapAsync(referenceController.locales)
  );

  router.get(
    '/nutrient-tables',
    anyPermission(['locales']),
    validation.browse,
    wrapAsync(referenceController.nutrientTables)
  );

  router.get(
    '/nutrient-tables/:nutrientTableId/records',
    anyPermission(['locales']),
    validation.browse,
    wrapAsync(referenceController.nutrientTableRecords)
  );

  router.get(
    '/nutrient-types',
    anyPermission(['feedback-schemes', 'survey-schemes']),
    validation.nutrientTypes,
    wrapAsync(referenceController.nutrientTypes)
  );

  router.get(
    '/standard-units',
    anyPermission(['survey-schemes']),
    validation.browse,
    wrapAsync(referenceController.standardUnits)
  );

  router.get(
    '/surveys',
    anyPermission(['tasks']),
    validation.browse,
    wrapAsync(referenceController.surveys)
  );

  router.get(
    '/survey-schemes',
    anyPermission(['survey-schemes', 'surveys']),
    validation.browse,
    wrapAsync(referenceController.surveySchemes)
  );

  return router;
};
