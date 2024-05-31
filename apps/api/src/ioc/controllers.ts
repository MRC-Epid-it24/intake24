import type { AwilixContainer } from 'awilix';
import { asFunction } from 'awilix';

import controllers from '@intake24/api/http/controllers';

export default (container: AwilixContainer): void => {
  container.register({
    // Admin
    referenceController: asFunction(controllers.admin.reference),

    adminCategoryController: asFunction(controllers.admin.fdbs.category),
    adminFoodController: asFunction(controllers.admin.fdbs.food),
    adminGlobalFoodsController: asFunction(controllers.admin.foods.globalFoods),
    adminLocalFoodsController: asFunction(controllers.admin.foods.localFoods),
    adminGlobalCategoriesController: asFunction(controllers.admin.categories.globalCategories),
    adminLocalCategoriesController: asFunction(controllers.admin.categories.localCategories),

    // Images
    asServedSetController: asFunction(controllers.admin.images.asServedSet),
    asServedImageController: asFunction(controllers.admin.images.asServedImage),
    drinkwareSetController: asFunction(controllers.admin.images.drinkwareSet),
    drinkScaleController: asFunction(controllers.admin.images.drinkScale),
    guideImageController: asFunction(controllers.admin.images.guide),
    imageMapController: asFunction(controllers.admin.images.map),

    // Locales
    localeController: asFunction(controllers.admin.locales.locale),
    localeRecipeFoodsController: asFunction(controllers.admin.locales.recipeFoods),
    localeSplitListController: asFunction(controllers.admin.locales.splitList),
    localeSplitWordController: asFunction(controllers.admin.locales.splitWord),
    localeSynonymSetController: asFunction(controllers.admin.locales.synonymSet),

    // Schemes
    surveySchemeController: asFunction(controllers.admin.surveyScheme),
    surveySchemePromptController: asFunction(controllers.admin.surveySchemePrompt),

    // Survey MGMT
    adminSurveyController: asFunction(controllers.admin.surveys.survey),
  });
};
