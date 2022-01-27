import { Router } from 'express';
import { anyPermission, permission } from '@intake24/api/http/middleware/acl';
import validation from '@intake24/api/http/requests/admin/survey-schemes';
import ioc from '@intake24/api/ioc';
import { wrapAsync } from '@intake24/api/util';

const { surveySchemeController } = ioc.cradle;
const router = Router();

router
  .route('')
  .post(
    permission('survey-schemes|create'),
    validation.store,
    wrapAsync(surveySchemeController.store)
  )
  .get(
    permission('survey-schemes|browse'),
    validation.browse,
    wrapAsync(surveySchemeController.browse)
  );

router.get(
  '/refs',
  anyPermission(['survey-schemes|create', 'survey-schemes|read', 'survey-schemes|edit']),
  wrapAsync(surveySchemeController.refs)
);

router.post(
  '/copy',
  permission('survey-schemes|edit'),
  validation.copy,
  wrapAsync(surveySchemeController.copy)
);

router
  .route('/:surveySchemeId')
  .get(permission('survey-schemes|read'), wrapAsync(surveySchemeController.read))
  .put(
    permission('survey-schemes|edit'),
    validation.update,
    wrapAsync(surveySchemeController.update)
  )
  .delete(permission('survey-schemes|delete'), wrapAsync(surveySchemeController.destroy));

router.get(
  '/:surveySchemeId/edit',
  permission('survey-schemes|edit'),
  wrapAsync(surveySchemeController.edit)
);
router.get(
  '/:surveySchemeId/templates',
  permission('survey-schemes|edit'),
  validation.templates,
  wrapAsync(surveySchemeController.templates)
);
router.get(
  '/:surveySchemeId/data-export',
  permission('survey-schemes|edit'),
  wrapAsync(surveySchemeController.dataExportRefs)
);

export default router;
