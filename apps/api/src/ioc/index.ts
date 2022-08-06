import { asClass, asValue, createContainer } from 'awilix';

import type {
  ACLConfig,
  AppConfig,
  CacheConfig,
  Config,
  FileSystemConfig,
  QueueConfig,
  RateLimiterConfig,
  SecurityConfig,
  ServicesConfig,
  SessionConfig,
} from '@intake24/api/config';
import type {
  // Admin
  AdminAuthenticationController,
  AdminCategoryController,
  AdminFoodController,
  AdminFoodDatabaseController,
  AdminFoodGroupController,
  AdminSurveyController,
  AdminSurveyDataExportController,
  AdminSurveyRespondentController,
  AdminSurveySubmissionController,
  AdminUserController,
  AdminUserJobController,
  AdminUserProfileController,
  AsServedImageController,
  AsServedSetController,
  AuthenticationController,
  CategoriesController,
  FeedbackController,
  FeedbackSchemeController,
  FoodController,
  FoodSearchController,
  GuideImageController,
  ImageMapController,
  JobController,
  LanguageController,
  LanguageTranslationController,
  LocaleController,
  LocaleSplitListController,
  LocaleSplitWordController,
  LocaleSynonymSetController,
  NutrientTableController,
  PasswordController,
  PermissionController,
  PortionSizeController,
  RoleController,
  SignInLogController,
  SubscriptionController,
  SurveyController,
  SurveyRespondentController,
  SurveySchemeController,
  SurveySchemeQuestionController,
  TaskController,
  // User
  UserFeedbackController,
  UserI18nController,
  UserPhysicalDataController,
  UserProfileController,
  UserSubmissionsController,
} from '@intake24/api/http/controllers';
import type { Jobs } from '@intake24/api/jobs';
import type {
  ACLService,
  AdminCategoryService,
  AdminFoodService,
  AdminSurveyService,
  AdminUserService,
  AsServedService,
  AuthenticationService,
  Cache,
  CategoryContentsService,
  DataExportFields,
  DataExportMapper,
  DataExportService,
  FeedbackService,
  Filesystem,
  FoodDataService,
  GuideImageService,
  ImageMapService,
  JwtRotationService,
  JwtService,
  LanguageService,
  LocaleService,
  // MFA Providers
  MFAProvider,
  NutrientTableService,
  PortionSizeService,
  ProcessedImageService,
  Pusher,
  RateLimiter,
  Scheduler,
  Session,
  SignInService,
  SourceImageService,
  SurveyService,
  UserService,
} from '@intake24/api/services';
import type { JobsQueueHandler, TasksQueueHandler } from '@intake24/api/services/core/queues';
import type { Environment } from '@intake24/common/types';
import type { DatabaseConfig, DatabasesInterface, User } from '@intake24/db';
import type { LogConfig, Logger, MailConfig, Mailer } from '@intake24/services';
import config from '@intake24/api/config';
import { Database, models } from '@intake24/db';

import controllers from './controllers';
import jobs from './jobs';
import services from './services';

export interface IoC extends Jobs {
  config: Config;
  aclConfig: ACLConfig;
  appConfig: AppConfig;
  cacheConfig: CacheConfig;
  databaseConfig: DatabaseConfig;
  fsConfig: FileSystemConfig;
  logConfig: LogConfig;
  mailConfig: MailConfig;
  queueConfig: QueueConfig;
  rateLimiterConfig: RateLimiterConfig;
  securityConfig: SecurityConfig;
  servicesConfig: ServicesConfig;
  sessionConfig: SessionConfig;
  // Expose some config settings directly to avoid pulling in the whole config when it doesn't
  // make sense, e.g. for testing
  environment: Environment;
  imagesBaseUrl: string;

  // Authenticated / scoped user vars
  // currentUser: User;
  // userId: string;

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
  adminAuthenticationController: AdminAuthenticationController;
  adminUserProfileController: AdminUserProfileController;
  adminUserJobController: AdminUserJobController;

  adminFoodDatabaseController: AdminFoodDatabaseController;
  adminCategoryController: AdminCategoryController;
  adminFoodController: AdminFoodController;
  adminFoodGroupController: AdminFoodGroupController;

  // Images
  asServedSetController: AsServedSetController;
  asServedImageController: AsServedImageController;
  guideImageController: GuideImageController;
  imageMapController: ImageMapController;

  // Localization
  languageController: LanguageController;
  languageTranslationController: LanguageTranslationController;
  localeController: LocaleController;
  localeSplitListController: LocaleSplitListController;
  localeSplitWordController: LocaleSplitWordController;
  localeSynonymSetController: LocaleSynonymSetController;
  nutrientTableController: NutrientTableController;

  // Schemes
  feedbackSchemeController: FeedbackSchemeController;
  surveySchemeController: SurveySchemeController;
  surveySchemeQuestionController: SurveySchemeQuestionController;

  // Survey MGMT
  adminSurveyController: AdminSurveyController;
  adminSurveyDataExportController: AdminSurveyDataExportController;
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
  models: typeof models;
  cache: Cache;
  filesystem: Filesystem;
  logger: Logger;
  mailer: Mailer;
  pusher: Pusher;
  rateLimiter: RateLimiter;
  scheduler: Scheduler;
  session: Session;

  // Queues
  jobsQueueHandler: JobsQueueHandler;
  tasksQueueHandler: TasksQueueHandler;

  // Authentication
  authenticationService: AuthenticationService;
  // aclService: ACLService;
  jwtService: JwtService;
  jwtRotationService: JwtRotationService;
  signInService: SignInService;

  // MFA Providers
  mfaProvider: MFAProvider;

  // Data export
  dataExportFields: DataExportFields;
  dataExportMapper: DataExportMapper;
  dataExportService: DataExportService;

  adminCategoryService: AdminCategoryService;
  adminFoodService: AdminFoodService;
  languageService: LanguageService;
  localeService: LocaleService;
  nutrientTableService: NutrientTableService;

  feedbackService: FeedbackService;

  // Foods
  foodDataService: FoodDataService;
  portionSizeService: PortionSizeService;

  // Categories
  categoryContentsService: CategoryContentsService;

  // Images
  processedImageService: ProcessedImageService;
  sourceImageService: SourceImageService;
  asServedService: AsServedService;
  guideImageService: GuideImageService;
  imageMapService: ImageMapService;

  // Survey / user
  adminSurveyService: AdminSurveyService;
  surveyService: SurveyService;
  adminUserService: AdminUserService;
  userService: UserService;
}

export interface RequestIoC extends IoC {
  currentUser: User;
  userId: string;
  aclService: ACLService;
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
    environment: asValue(config.app.env),
    imagesBaseUrl: asValue(config.app.urls.images),

    db: asClass(Database).singleton(),
    models: asValue(models),
  });

  controllers(container);
  services(container);
  jobs(container);

  return container;
};

export default configureContainer();
