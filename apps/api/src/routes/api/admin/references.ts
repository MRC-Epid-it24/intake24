import { Router } from 'express';

import { anyPermission } from '@intake24/api/http/middleware';
import { browse } from '@intake24/api/http/requests/admin/generic';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

export default () => {
  const { referenceController } = ioc.cradle;
  const router = Router();

  router.get(
    '/as-served-sets',
    anyPermission(['fdbs']),
    browse,
    wrapAsync(referenceController.asServedSets)
  );

  router.get(
    '/drinkware-sets',
    anyPermission(['fdbs']),
    browse,
    wrapAsync(referenceController.drinkwareSets)
  );

  router.get(
    '/feedback-schemes',
    anyPermission(['feedback-schemes', 'surveys']),
    browse,
    wrapAsync(referenceController.feedbackSchemes)
  );

  router.get(
    '/guide-images',
    anyPermission(['fdbs']),
    browse,
    wrapAsync(referenceController.guideImages)
  );

  router.get(
    '/image-maps',
    anyPermission(['fdbs', 'guide-images']),
    browse,
    wrapAsync(referenceController.guideImages)
  );

  router.get(
    '/languages',
    anyPermission(['locales', 'feedback-schemes', 'survey-schemes']),
    browse,
    wrapAsync(referenceController.languages)
  );

  router.get(
    '/locales',
    anyPermission(['surveys', 'tasks']),
    browse,
    wrapAsync(referenceController.locales)
  );

  router.get(
    '/nutrient-tables',
    anyPermission(['fdbs']),
    browse,
    wrapAsync(referenceController.nutrientTables)
  );

  router.get(
    '/standard-units',
    anyPermission(['survey-schemes']),
    browse,
    wrapAsync(referenceController.standardUnits)
  );

  router.get('/surveys', anyPermission(['tasks']), browse, wrapAsync(referenceController.surveys));

  router.get(
    '/survey-schemes',
    anyPermission(['survey-schemes', 'surveys']),
    browse,
    wrapAsync(referenceController.surveySchemes)
  );

  return router;
};
