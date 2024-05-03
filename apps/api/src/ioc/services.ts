import type { AwilixContainer } from 'awilix';
import { asClass, asFunction, asValue } from 'awilix';

import foodIndex from '@intake24/api/food-index';
import {
  aclCache,
  aclService,
  adminCategoryService,
  adminFoodService,
  adminSignupService,
  adminSurveyService,
  adminUserService,
  asServedService,
  authenticationService,
  Cache,
  cachedParentCategoriesService,
  categoryContentsService,
  dataExportFields,
  dataExportMapper,
  dataExportService,
  drinkwareSetService,
  duoProvider,
  feedbackService,
  fidoProvider,
  Filesystem,
  foodDataService,
  foodSearchService,
  globalCategoriesService,
  globalFoodsService,
  guideImageService,
  i18nService,
  i18nStore,
  imageMapService,
  inheritableAttributesService,
  jwtRotationService,
  jwtService,
  languageService,
  localCategoriesService,
  localeService,
  localFoodsService,
  nutrientTableService,
  nutrientTypeService,
  nutrientUnitService,
  otpProvider,
  pairwiseSearchService,
  PopularityCountersService,
  portionSizeMethodsService,
  portionSizeService,
  processedImageService,
  Publisher,
  Pusher,
  RateLimiter,
  Scheduler,
  Session,
  signInService,
  sourceImageService,
  Subscriber,
  surveyService,
  surveySubmissionService,
  userService,
} from '@intake24/api/services';
import { JobsQueueHandler, TasksQueueHandler } from '@intake24/api/services/core/queues';
import { logger, Mailer } from '@intake24/common-backend';

export default (container: AwilixContainer): void => {
  container.register({
    authenticationService: asFunction(authenticationService).singleton(),
    aclCache: asFunction(aclCache).singleton(),
    aclService: asFunction(aclService).scoped(),

    duoProvider: asFunction(duoProvider).singleton(),
    fidoProvider: asFunction(fidoProvider).singleton(),
    otpProvider: asFunction(otpProvider).singleton(),

    jwtService: asFunction(jwtService).singleton(),
    jwtRotationService: asFunction(jwtRotationService).singleton(),
    signInService: asFunction(signInService).singleton(),

    asServedService: asFunction(asServedService).singleton(),
    drinkwareSetService: asFunction(drinkwareSetService).singleton(),
    guideImageService: asFunction(guideImageService).singleton(),
    imageMapService: asFunction(imageMapService).singleton(),
    processedImageService: asFunction(processedImageService).singleton(),
    sourceImageService: asFunction(sourceImageService).singleton(),

    feedbackService: asFunction(feedbackService).singleton(),
    foodDataService: asFunction(foodDataService).singleton(),
    foodSearchService: asFunction(foodSearchService).singleton(),
    foodIndex: asValue(foodIndex),
    portionSizeMethodsService: asFunction(portionSizeMethodsService).singleton(),
    portionSizeService: asFunction(portionSizeService).singleton(),
    categoryContentsService: asFunction(categoryContentsService).singleton(),
    inheritableAttributesService: asFunction(inheritableAttributesService).singleton(),
    cachedParentCategoriesService: asFunction(cachedParentCategoriesService).singleton(),

    pairwiseSearchService: asFunction(pairwiseSearchService).singleton(),

    adminCategoryService: asFunction(adminCategoryService).singleton(),
    adminFoodService: asFunction(adminFoodService).singleton(),
    localFoodsService: asFunction(localFoodsService).singleton(),
    globalFoodsService: asFunction(globalFoodsService).singleton(),
    localCategoriesService: asFunction(localCategoriesService).singleton(),
    globalCategoriesService: asFunction(globalCategoriesService).singleton(),

    languageService: asFunction(languageService).singleton(),
    localeService: asFunction(localeService).singleton(),
    nutrientTableService: asFunction(nutrientTableService).singleton(),
    nutrientTypeService: asFunction(nutrientTypeService).singleton(),
    nutrientUnitService: asFunction(nutrientUnitService).singleton(),

    dataExportFields: asFunction(dataExportFields).singleton(),
    dataExportMapper: asFunction(dataExportMapper).singleton(),
    dataExportService: asFunction(dataExportService).singleton(),

    adminSignupService: asFunction(adminSignupService).singleton(),
    adminSurveyService: asFunction(adminSurveyService).singleton(),
    adminUserService: asFunction(adminUserService).singleton(),

    surveyService: asFunction(surveyService).singleton(),
    surveySubmissionService: asFunction(surveySubmissionService).singleton(),
    popularityCountersService: asClass(PopularityCountersService).singleton(),
    userService: asFunction(userService).singleton(),

    cache: asClass(Cache).singleton(),
    filesystem: asClass(Filesystem).singleton(),
    i18nService: asFunction(i18nService).scoped(),
    i18nStore: asFunction(i18nStore).singleton(),
    logger: asValue(logger),
    mailer: asClass(Mailer).singleton(),
    pusher: asClass(Pusher).singleton(),
    rateLimiter: asClass(RateLimiter).singleton(),
    reindexingSubscriberService: asClass(Subscriber).singleton(),
    reindexingPublisherService: asClass(Publisher).singleton(),
    scheduler: asClass(Scheduler).singleton(),
    session: asClass(Session).singleton(),

    jobsQueueHandler: asClass(JobsQueueHandler).singleton(),
    tasksQueueHandler: asClass(TasksQueueHandler).singleton(),
  });
};
