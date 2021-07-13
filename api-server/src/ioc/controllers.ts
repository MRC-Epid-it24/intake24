import { asFunction, AwilixContainer } from 'awilix';
import controllers from '@/http/controllers';

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
    schemeController: asFunction(controllers.admin.scheme),
    schemeQuestionController: asFunction(controllers.admin.schemeQuestion),

    adminSurveyController: asFunction(controllers.admin.survey),
    adminSurveyDataExportController: asFunction(controllers.admin.surveyDataExport),
    adminSurveyMgmtController: asFunction(controllers.admin.surveyMgmt),
    adminSurveyRespondentController: asFunction(controllers.admin.surveyRespondent),
    adminSurveySubmissionController: asFunction(controllers.admin.surveySubmission),

    jobController: asFunction(controllers.admin.job),
    signInLogController: asFunction(controllers.admin.signInLog),
    taskController: asFunction(controllers.admin.task),

    permissionController: asFunction(controllers.admin.acl.permission),
    roleController: asFunction(controllers.admin.acl.role),
    userController: asFunction(controllers.admin.acl.user),
  });
};
