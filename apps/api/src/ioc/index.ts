import { asClass, asValue, createContainer } from 'awilix';

import type { Config } from '@intake24/api/config';
import type {
  // Admin
  AdminAuthenticationController,
  AdminCategoryController,
  AdminFoodController,
  AdminFoodDatabaseController,
  AdminFoodGroupController,
  AdminGlobalFoodsController,
  AdminLocalFoodsController,
  AdminSignupController,
  AdminSurveyController,
  AdminSurveyRespondentController,
  AdminSurveySubmissionController,
  AdminUserController,
  AdminUserJobController,
  AdminUserProfileController,
  AsServedImageController,
  AsServedSetController,
  AuthenticationController,
  CategoriesController,
  DrinkwareSetController,
  DuoDeviceController,
  FeedbackController,
  FeedbackSchemeController,
  FIDODeviceController,
  FoodController,
  FoodSearchController,
  GuideImageController,
  ImageMapController,
  JobController,
  LanguageController,
  LanguageTranslationController,
  LocaleController,
  LocaleRecipeFoodsController,
  LocaleSplitListController,
  LocaleSplitWordController,
  LocaleSynonymSetController,
  MFADeviceController,
  NutrientTableController,
  NutrientTypeController,
  NutrientUnitController,
  OTPDeviceController,
  PasswordController,
  PermissionController,
  PersonalAccessTokenController,
  PortionSizeController,
  ReferenceController,
  RoleController,
  SignInLogController,
  StandardUnitController,
  SubscriptionController,
  SurveyController,
  SurveyRespondentController,
  SurveySchemeController,
  SurveySchemePromptController,
  TaskController,
  // User
  UserFeedbackController,
  UserI18nController,
  UserPhysicalDataController,
  UserProfileController,
  UserSubmissionsController,
} from '@intake24/api/http/controllers';
import type { DrinkScaleController } from '@intake24/api/http/controllers/admin/images/drink-scale.controller';
import type { Jobs } from '@intake24/api/jobs';
import type {
  ACLCache,
  ACLService,
  AdminCategoryService,
  AdminFoodService,
  AdminSignupService,
  AdminSurveyService,
  AdminUserService,
  AsServedService,
  AuthenticationService,
  Cache,
  CachedInheritableAttributesService,
  CategoryContentsService,
  DataExportFields,
  DataExportMapper,
  DataExportService,
  DrinkwareSetService,
  DuoProvider,
  FeedbackService,
  FIDOProvider,
  Filesystem,
  FoodDataService,
  GlobalFoodsService,
  GuideImageService,
  I18nService,
  I18nStore,
  ImageMapService,
  JwtRotationService,
  JwtService,
  LanguageService,
  LocaleService,
  LocalFoodsService,
  NutrientTableService,
  NutrientTypeService,
  NutrientUnitService,
  OTPProvider,
  PairwiseSearchService,
  PopularityCountersService,
  PortionSizeMethodsService,
  PortionSizeService,
  ProcessedImageService,
  Pusher,
  RateLimiter,
  RedisPublisher,
  RedisSubscriber,
  Scheduler,
  Session,
  SignInService,
  SourceImageService,
  SurveyService,
  SurveySubmissionService,
  UserService,
} from '@intake24/api/services';
import type { JobsQueueHandler, TasksQueueHandler } from '@intake24/api/services/core/queues';
import type { CachedParentCategoriesService } from '@intake24/api/services/foods/cached-parent-categories-service';
import type { InheritableAttributesService } from '@intake24/api/services/foods/inheritable-attributes-service';
import type { TokenPayload } from '@intake24/common/security';
import type { Environment } from '@intake24/common/types';
import type { Logger, Mailer } from '@intake24/common-backend';
import type { DatabasesInterface } from '@intake24/db';
import config from '@intake24/api/config';
import { Database, KyselyDatabases, models } from '@intake24/db';

import controllers from './controllers';
import jobs from './jobs';
import services from './services';

export interface IoC extends Jobs {
  config: Config;
  aclConfig: Config['acl'];
  appConfig: Config['app'];
  cacheConfig: Config['cache'];
  databaseConfig: Config['database'];
  fsConfig: Config['filesystem'];
  logConfig: Config['log'];
  mailConfig: Config['mail'];
  queueConfig: Config['queue'];
  rateLimiterConfig: Config['rateLimiter'];
  publisherConfig: Config['publisher'];
  setConfig: Config['set'];
  subscriberConfig: Config['subscriber'];
  securityConfig: Config['security'];
  servicesConfig: Config['services'];
  sessionConfig: Config['session'];
  imageProcessorConfig: Config['imageProcessor'];
  // Expose some config settings directly to avoid pulling in the whole config when it doesn't
  // make sense, e.g. for testing
  environment: Environment;
  imagesBaseUrl: string;

  // Authenticated / scoped user vars
  // user: TokenPayload;

  // Controllers
  authenticationController: AuthenticationController;
  passwordController: PasswordController;
  subscriptionController: SubscriptionController;

  // User
  userFeedbackController: UserFeedbackController;
  userI18nController: UserI18nController;
  userProfileController: UserProfileController;
  userPhysicalDataController: UserPhysicalDataController;
  userSubmissionsController: UserSubmissionsController;

  // Survey controllers
  foodController: FoodController;
  categoriesController: CategoriesController;
  foodSearchController: FoodSearchController;
  portionSizeController: PortionSizeController;
  surveyController: SurveyController;
  surveyRespondentController: SurveyRespondentController;

  // Feedback controllers
  feedbackController: FeedbackController;

  // Admin controllers
  referenceController: ReferenceController;

  adminAuthenticationController: AdminAuthenticationController;
  adminSignupController: AdminSignupController;
  adminUserProfileController: AdminUserProfileController;
  adminUserJobController: AdminUserJobController;
  personalAccessTokenController: PersonalAccessTokenController;

  mfaDeviceController: MFADeviceController;
  duoDeviceController: DuoDeviceController;
  fidoDeviceController: FIDODeviceController;
  otpDeviceController: OTPDeviceController;

  adminFoodDatabaseController: AdminFoodDatabaseController;
  adminCategoryController: AdminCategoryController;
  adminFoodController: AdminFoodController;
  adminFoodGroupController: AdminFoodGroupController;
  adminGlobalFoodsController: AdminGlobalFoodsController;
  adminLocalFoodsController: AdminLocalFoodsController;

  // Images
  asServedSetController: AsServedSetController;
  asServedImageController: AsServedImageController;
  drinkwareSetController: DrinkwareSetController;
  drinkScaleController: DrinkScaleController;
  guideImageController: GuideImageController;
  imageMapController: ImageMapController;

  // Localization
  languageController: LanguageController;
  languageTranslationController: LanguageTranslationController;
  localeController: LocaleController;
  localeRecipeFoodsController: LocaleRecipeFoodsController;
  localeSplitListController: LocaleSplitListController;
  localeSplitWordController: LocaleSplitWordController;
  localeSynonymSetController: LocaleSynonymSetController;
  nutrientTableController: NutrientTableController;
  nutrientTypeController: NutrientTypeController;
  nutrientUnitController: NutrientUnitController;
  standardUnitController: StandardUnitController;

  // Schemes
  feedbackSchemeController: FeedbackSchemeController;
  surveySchemeController: SurveySchemeController;
  surveySchemePromptController: SurveySchemePromptController;

  // Survey MGMT
  adminSurveyController: AdminSurveyController;
  adminSurveyRespondentController: AdminSurveyRespondentController;
  adminSurveySubmissionController: AdminSurveySubmissionController;

  // System controllers
  jobController: JobController;
  signInLogController: SignInLogController;
  taskController: TaskController;

  // ACL controllers
  permissionController: PermissionController;
  roleController: RoleController;
  adminUserController: AdminUserController;

  // System services
  db: DatabasesInterface;
  kyselyDb: KyselyDatabases;
  models: typeof models;
  cache: Cache;
  filesystem: Filesystem;
  i18nService: I18nService;
  i18nStore: I18nStore;
  logger: Logger;
  mailer: Mailer;
  pusher: Pusher;
  rateLimiter: RateLimiter;
  redisIndexingSubscriberService: RedisSubscriber;
  redisIndexingPublisherService: RedisPublisher;
  scheduler: Scheduler;
  session: Session;

  // Queues
  jobsQueueHandler: JobsQueueHandler;
  tasksQueueHandler: TasksQueueHandler;

  // Authentication
  aclCache: ACLCache;
  authenticationService: AuthenticationService;
  jwtService: JwtService;
  jwtRotationService: JwtRotationService;
  signInService: SignInService;

  // MFA Providers
  otpProvider: OTPProvider;
  fidoProvider: FIDOProvider;
  duoProvider: DuoProvider;

  // Data export
  dataExportFields: DataExportFields;
  dataExportMapper: DataExportMapper;
  dataExportService: DataExportService;

  adminCategoryService: AdminCategoryService;
  adminFoodService: AdminFoodService;
  localFoodsService: LocalFoodsService;
  globalFoodsService: GlobalFoodsService;
  languageService: LanguageService;
  localeService: LocaleService;
  nutrientTableService: NutrientTableService;
  nutrientTypeService: NutrientTypeService;
  nutrientUnitService: NutrientUnitService;

  feedbackService: FeedbackService;

  // Foods
  foodDataService: FoodDataService;
  portionSizeMethodsService: PortionSizeMethodsService;
  portionSizeService: PortionSizeService;
  inheritableAttributesService: InheritableAttributesService;
  cachedInheritableAttributesService: CachedInheritableAttributesService;
  cachedParentCategoriesService: CachedParentCategoriesService;

  // Categories
  categoryContentsService: CategoryContentsService;

  // Search
  pairwiseSearchService: PairwiseSearchService;

  // Images
  processedImageService: ProcessedImageService;
  sourceImageService: SourceImageService;
  asServedService: AsServedService;
  drinkwareSetService: DrinkwareSetService;
  guideImageService: GuideImageService;
  imageMapService: ImageMapService;

  // Survey / user
  adminSignupService: AdminSignupService;
  adminSurveyService: AdminSurveyService;
  adminUserService: AdminUserService;

  surveyService: SurveyService;
  surveySubmissionService: SurveySubmissionService;
  popularityCountersService: PopularityCountersService;
  userService: UserService;
}

export interface RequestIoC extends IoC {
  user: TokenPayload;
  aclService: ACLService;
  clientLanguages: string[];
}

const configureContainer = () => {
  const container = createContainer<IoC>();

  container.register({
    config: asValue(config),
    aclConfig: asValue(config.acl),
    appConfig: asValue(config.app),
    cacheConfig: asValue(config.cache),
    databaseConfig: asValue(config.database),
    fsConfig: asValue(config.filesystem),
    logConfig: asValue(config.log),
    mailConfig: asValue(config.mail),
    queueConfig: asValue(config.queue),
    rateLimiterConfig: asValue(config.rateLimiter),
    securityConfig: asValue(config.security),
    servicesConfig: asValue(config.services),
    sessionConfig: asValue(config.session),
    setConfig: asValue(config.set),
    publisherConfig: asValue(config.publisher),
    subscriberConfig: asValue(config.subscriber),
    environment: asValue(config.app.env),
    imagesBaseUrl: asValue(config.app.urls.images),
    imageProcessorConfig: asValue(config.imageProcessor),

    db: asClass(Database).singleton(),
    kyselyDb: asClass(KyselyDatabases).singleton(),
    models: asValue(models),
  });

  controllers(container);
  services(container);
  jobs(container);

  return container;
};

export default configureContainer();
