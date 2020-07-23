import { Router } from 'express';
import passport from 'passport';
import { wrapAsync } from '@/util';
import foodController from '@/http/controllers/food.controller';
import foodSearchController from '@/http/controllers/food-search.controller';
import { isSuperUser, isSurveyRespondent } from '@/http/middleware/acl';

const router = Router();

router.use(passport.authenticate('jwt', { session: false }));
router.use(isSuperUser());

// Food search
router.get('/:locale', wrapAsync(foodSearchController.lookup));
router.get('/:locale/recipes', wrapAsync(foodSearchController.recipe));
router.get('/:locale/category', wrapAsync(foodSearchController.category));
router.get('/:locale/split-description', wrapAsync(foodSearchController.splitDescription));

// Food data
router.get('/:locale/:code', wrapAsync(foodController.entry));
router.get('/:locale/:code/sources', wrapAsync(foodController.entryWithSource));
router.get('/:locale/:code/brands', wrapAsync(foodController.brands));
router.get('/:locale/:code/associated-foods', wrapAsync(foodController.associatedFoods));
router.get('/:locale/:code/composition', wrapAsync(foodController.composition));

export default router;
