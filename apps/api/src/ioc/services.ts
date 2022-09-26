import type { AwilixContainer } from 'awilix';
import { asClass, asFunction, asValue } from 'awilix';

import {
  aclService,
  adminCategoryService,
  adminFoodService,
  adminSignupService,
  adminSurveyService,
  adminUserService,
  asServedService,
  authenticationService,
  Cache,
  dataExportFields,
  dataExportMapper,
  dataExportService,
  duoSecurityProvider,
  feedbackService,
  Filesystem,
  foodDataService,
  guideImageService,
  i18nService,
  i18nStore,
  imageMapService,
  jwtRotationService,
  jwtService,
  languageService,
  localeService,
  nutrientTableService,
  nutrientTypeService,
  nutrientUnitService,
  pairwiseSearchService,
  popularitySearchService,
  portionSizeService,
  processedImageService,
  Pusher,
  RateLimiter,
  Scheduler,
  Session,
  signInService,
  sourceImageService,
  surveyService,
  surveySubmissionService,
  userService,
} from '@intake24/api/services';
import { JobsQueueHandler, TasksQueueHandler } from '@intake24/api/services/core/queues';
import categoryContentsService from '@intake24/api/services/foods/category-contents.service';
import { logger, Mailer } from '@intake24/services';

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
    categoryContentsService: asFunction(categoryContentsService),

    pairwiseSearchService: asFunction(pairwiseSearchService),
    popularitySearchService: asFunction(popularitySearchService),

    adminCategoryService: asFunction(adminCategoryService),
    adminFoodService: asFunction(adminFoodService),
    languageService: asFunction(languageService),
    localeService: asFunction(localeService),
    nutrientTableService: asFunction(nutrientTableService),
    nutrientTypeService: asFunction(nutrientTypeService),
    nutrientUnitService: asFunction(nutrientUnitService),

    dataExportFields: asFunction(dataExportFields),
    dataExportMapper: asFunction(dataExportMapper),
    dataExportService: asFunction(dataExportService),

    adminSignupService: asFunction(adminSignupService),
    adminSurveyService: asFunction(adminSurveyService),
    adminUserService: asFunction(adminUserService),

    surveyService: asFunction(surveyService),
    surveySubmissionService: asFunction(surveySubmissionService),
    userService: asFunction(userService),

    cache: asClass(Cache).singleton(),
    filesystem: asClass(Filesystem).singleton(),
    i18nService: asFunction(i18nService).scoped(),
    i18nStore: asFunction(i18nStore).singleton(),
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
