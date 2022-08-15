import type { AwilixContainer } from 'awilix';
import { asFunction } from 'awilix';

import controllers from '@intake24/api/http/controllers';

export default (container: AwilixContainer): void => {
  container.register({
    authenticationController: asFunction(controllers.authentication),
    passwordController: asFunction(controllers.password),
    subscriptionController: asFunction(controllers.subscription),

    userFeedbackController: asFunction(controllers.user.feedback),
    userI18nController: asFunction(controllers.i18n),
    userProfileController: asFunction(controllers.user.profile),
    userPhysicalDataController: asFunction(controllers.user.physicalData),
    userSubmissionsController: asFunction(controllers.user.submissions),

    foodController: asFunction(controllers.food),
    foodSearchController: asFunction(controllers.foodSearch),
    portionSizeController: asFunction(controllers.portionSize),
    categoriesController: asFunction(controllers.categories),
    surveyController: asFunction(controllers.survey),
    surveyRespondentController: asFunction(controllers.surveyRespondent),

    // Feedback
    feedbackController: asFunction(controllers.feedback),

    // Admin
    referenceController: asFunction(controllers.admin.reference),

    adminAuthenticationController: asFunction(controllers.admin.authentication),
    adminUserProfileController: asFunction(controllers.admin.user.profile),
    adminUserJobController: asFunction(controllers.admin.user.job),

    adminFoodDatabaseController: asFunction(controllers.admin.foods.fdb),
    adminCategoryController: asFunction(controllers.admin.foods.category),
    adminFoodController: asFunction(controllers.admin.foods.food),
    adminFoodGroupController: asFunction(controllers.admin.foods.foodGroup),

    // Images
    asServedSetController: asFunction(controllers.admin.images.asServedSet),
    asServedImageController: asFunction(controllers.admin.images.asServedImage),
    drinkwareSetController: asFunction(controllers.admin.images.drinkwareSet),
    guideImageController: asFunction(controllers.admin.images.guide),
    imageMapController: asFunction(controllers.admin.images.map),

    // Localization
    languageController: asFunction(controllers.admin.language),
    languageTranslationController: asFunction(controllers.admin.languageTranslation),

    // Locales
    localeController: asFunction(controllers.admin.locales.locale),
    localeSplitListController: asFunction(controllers.admin.locales.splitList),
    localeSplitWordController: asFunction(controllers.admin.locales.splitWord),
    localeSynonymSetController: asFunction(controllers.admin.locales.synonymSet),
    nutrientTableController: asFunction(controllers.admin.nutrientTable),

    // Schemes
    feedbackSchemeController: asFunction(controllers.admin.feedbackScheme),
    surveySchemeController: asFunction(controllers.admin.surveyScheme),
    surveySchemeQuestionController: asFunction(controllers.admin.surveySchemeQuestion),

    // Survey MGMT
    adminSurveyController: asFunction(controllers.admin.surveys.survey),
    adminSurveyDataExportController: asFunction(controllers.admin.surveys.dataExport),
    adminSurveyRespondentController: asFunction(controllers.admin.surveys.respondent),
    adminSurveySubmissionController: asFunction(controllers.admin.surveys.submission),

    // System
    jobController: asFunction(controllers.admin.job),
    signInLogController: asFunction(controllers.admin.signInLog),
    taskController: asFunction(controllers.admin.task),

    // ACL
    permissionController: asFunction(controllers.admin.acl.permission),
    roleController: asFunction(controllers.admin.acl.role),
    adminUserController: asFunction(controllers.admin.acl.user),
  });
};
