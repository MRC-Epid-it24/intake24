import { asFunction, AwilixContainer } from 'awilix';

import controllers from '@/http/controllers';

export default (container: AwilixContainer): void => {
  container.register({
    authenticationController: asFunction(controllers.authentication),
    passwordController: asFunction(controllers.password),

    foodController: asFunction(controllers.food),
    foodSearchController: asFunction(controllers.foodSearch),
    portionSizeController: asFunction(controllers.portionSize),
    surveyController: asFunction(controllers.survey),

    profileController: asFunction(controllers.admin.profile),
    jobController: asFunction(controllers.admin.job),

    languageController: asFunction(controllers.admin.language),
    localeController: asFunction(controllers.admin.locale),
    schemeController: asFunction(controllers.admin.scheme),

    adminSurveyController: asFunction(controllers.admin.survey),
    adminSurveyDataExportController: asFunction(controllers.admin.surveyDataExport),
    adminSurveyRespondentController: asFunction(controllers.admin.surveyRespondent),
    adminSurveyMgmtController: asFunction(controllers.admin.surveyMgmt),

    taskController: asFunction(controllers.admin.task),

    permissionController: asFunction(controllers.admin.permission),
    roleController: asFunction(controllers.admin.role),
    userController: asFunction(controllers.admin.user),
  });
};
