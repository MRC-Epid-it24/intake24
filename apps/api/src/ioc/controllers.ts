import { asFunction, AwilixContainer } from 'awilix';
import controllers from '@api/http/controllers';

export default (container: AwilixContainer): void => {
  container.register({
    authenticationController: asFunction(controllers.authentication),
    passwordController: asFunction(controllers.password),
    subscriptionController: asFunction(controllers.subscription),

    foodController: asFunction(controllers.food),
    foodSearchController: asFunction(controllers.foodSearch),
    portionSizeController: asFunction(controllers.portionSize),
    surveyController: asFunction(controllers.survey),
    surveyRespondentController: asFunction(controllers.surveyRespondent),

    // Admin
    userProfileController: asFunction(controllers.admin.user.profile),
    userJobController: asFunction(controllers.admin.user.job),

    asServedSetController: asFunction(controllers.admin.images.asServedSet),
    asServedImageController: asFunction(controllers.admin.images.asServedImage),
    guideImageController: asFunction(controllers.admin.images.guide),
    imageMapController: asFunction(controllers.admin.images.map),
    languageController: asFunction(controllers.admin.language),
    localeController: asFunction(controllers.admin.locale),
    nutrientTableController: asFunction(controllers.admin.nutrientTable),
    schemeController: asFunction(controllers.admin.scheme),
    schemeQuestionController: asFunction(controllers.admin.schemeQuestion),

    adminSurveyController: asFunction(controllers.admin.surveys.survey),
    adminSurveyDataExportController: asFunction(controllers.admin.surveys.dataExport),
    adminSurveyMgmtController: asFunction(controllers.admin.surveys.mgmt),
    adminSurveyRespondentController: asFunction(controllers.admin.surveys.respondent),
    adminSurveySubmissionController: asFunction(controllers.admin.surveys.submission),

    jobController: asFunction(controllers.admin.job),
    signInLogController: asFunction(controllers.admin.signInLog),
    taskController: asFunction(controllers.admin.task),

    permissionController: asFunction(controllers.admin.acl.permission),
    roleController: asFunction(controllers.admin.acl.role),
    userController: asFunction(controllers.admin.acl.user),
  });
};
