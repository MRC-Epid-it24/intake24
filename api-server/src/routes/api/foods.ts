import { Router } from 'express';
import passport from 'passport';
import { wrapAsync } from '@/util';
import ioc from '@/ioc';

const { foodController, foodSearchController } = ioc.cradle;

const router = Router();

router.use(passport.authenticate('user', { session: false }));

// Food search
router.get('/:localeId', wrapAsync(foodSearchController.lookup));
router.get('/:localeId/recipes', wrapAsync(foodSearchController.recipe));
router.get('/:localeId/category', wrapAsync(foodSearchController.category));
router.get('/:localeId/split-description', wrapAsync(foodSearchController.splitDescription));

// Food data
router.get('/:localeId/:code', wrapAsync(foodController.entry));
router.get('/:localeId/:code/sources', wrapAsync(foodController.entryWithSource));
router.get('/:localeId/:code/brands', wrapAsync(foodController.brands));
router.get('/:localeId/:code/associated-foods', wrapAsync(foodController.associatedFoods));
router.get('/:localeId/:code/composition', wrapAsync(foodController.composition));

export default router;
