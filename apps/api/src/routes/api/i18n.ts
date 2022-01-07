import { Router } from 'express';
import ioc from '@api/ioc';
import { wrapAsync } from '@api/util';
import validation from '@api/http/requests/i18n';

const { userI18nController } = ioc.cradle;

const router = Router();

router.get('', wrapAsync(userI18nController.browse));
router.get('/:languageId', validation.entry, wrapAsync(userI18nController.entry));

export default router;
