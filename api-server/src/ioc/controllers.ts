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

    userProfileController: asFunction(controllers.admin.user.profile),
    userJobController: asFunction(controllers.admin.user.job),

    languageController: asFunction(controllers.admin.language),
    localeController: asFunction(controllers.admin.locale),
    schemeController: asFunction(controllers.admin.scheme),

    adminSurveyController: asFunction(controllers.admin.survey),
    adminSurveyDataExportController: asFunction(controllers.admin.surveyDataExport),
    adminSurveyMgmtController: asFunction(controllers.admin.surveyMgmt),
    adminSurveyRespondentController: asFunction(controllers.admin.surveyRespondent),
    adminSurveySubmissionController: asFunction(controllers.admin.surveySubmission),

    jobController: asFunction(controllers.admin.job),
    taskController: asFunction(controllers.admin.task),

    permissionController: asFunction(controllers.admin.acl.permission),
    roleController: asFunction(controllers.admin.acl.role),
    userController: asFunction(controllers.admin.acl.user),
  });
};
