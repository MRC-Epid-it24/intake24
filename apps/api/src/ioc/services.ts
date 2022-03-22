import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import { logger } from '@intake24/services';
import {
  authenticationService,
  aclService,
  duoSecurityProvider,
  jwtService,
  jwtRotationService,
  signInService,
  dataExportFields,
  dataExportMapper,
  dataExportService,
  Cache,
  Filesystem,
  Mailer,
  Pusher,
  RateLimiter,
  Scheduler,
  Session,
  adminCategoryService,
  adminFoodService,
  adminSurveyService,
  adminUserService,
  asServedService,
  guideImageService,
  imageMapService,
  processedImageService,
  sourceImageService,
  languageService,
  nutrientTableService,
  foodDataService,
  portionSizeService,
  feedbackService,
  surveyService,
  userService,
} from '@intake24/api/services';

import { JobsQueueHandler, TasksQueueHandler } from '@intake24/api/services/core/queues';

export default (container: AwilixContainer): void => {
  container.register({
    authenticationService: asFunction(authenticationService),
    aclService: asFunction(aclService).scoped(),
    mfaProvider: asFunction(duoSecurityProvider),
    jwtService: asFunction(jwtService),
    jwtRotationService: asFunction(jwtRotationService),
    signInService: asFunction(signInService),

    asServedService: asFunction(asServedService),
    guideImageService: asFunction(guideImageService),
    imageMapService: asFunction(imageMapService),
    processedImageService: asFunction(processedImageService),
    sourceImageService: asFunction(sourceImageService),

    feedbackService: asFunction(feedbackService),
    foodDataService: asFunction(foodDataService),
    portionSizeService: asFunction(portionSizeService),

    adminCategoryService: asFunction(adminCategoryService),
    adminFoodService: asFunction(adminFoodService),
    languageService: asFunction(languageService),
    nutrientTableService: asFunction(nutrientTableService),

    dataExportFields: asFunction(dataExportFields),
    dataExportMapper: asFunction(dataExportMapper),
    dataExportService: asFunction(dataExportService),

    adminSurveyService: asFunction(adminSurveyService),
    surveyService: asFunction(surveyService),
    adminUserService: asFunction(adminUserService),
    userService: asFunction(userService),

    cache: asClass(Cache).singleton(),
    filesystem: asClass(Filesystem).singleton(),
    logger: asValue(logger),
    mailer: asClass(Mailer).singleton(),
    pusher: asClass(Pusher).singleton(),
    rateLimiter: asClass(RateLimiter).singleton(),
    scheduler: asClass(Scheduler).singleton(),
    session: asClass(Session).singleton(),

    jobsQueueHandler: asClass(JobsQueueHandler).singleton(),
    tasksQueueHandler: asClass(TasksQueueHandler).singleton(),
  });
};
