import { createContainer, asClass, asValue } from 'awilix';

import config from '@intake24/api/config';
import type {
  ACLConfig,
  AppConfig,
  CacheConfig,
  Config,
  FileSystemConfig,
  MailConfig,
  QueueConfig,
  RateLimiterConfig,
  SecurityConfig,
  ServicesConfig,
  SessionConfig,
} from '@intake24/api/config';
import { Database, DatabaseConfig, DatabasesInterface, models } from '@intake24/db';
import type { Logger, LogConfig } from '@intake24/services';
import type {
  AuthenticationController,
  PasswordController,
  SubscriptionController,
  FeedbackController,
  FoodController,
  FoodSearchController,
  PortionSizeController,
  SurveyController,
  SurveyRespondentController,
  // User
  UserFeedbackController,
  UserI18nController,
  UserPhysicalDataController,
  UserProfileController,
  UserSubmissionsController,
  // Admin
  AdminAuthenticationController,
  AdminUserController,
  AdminUserProfileController,
  AdminUserJobController,
  AdminFoodDatabaseController,
  AdminCategoryController,
  AdminFoodController,
  AdminFoodGroupController,
  AsServedSetController,
  AsServedImageController,
  GuideImageController,
  ImageMapController,
  JobController,
  LanguageController,
  LocaleController,
  NutrientTableController,
  FeedbackSchemeController,
  SurveySchemeController,
  SurveySchemeQuestionController,
  SignInLogController,
  AdminSurveyController,
  AdminSurveyDataExportController,
  AdminSurveyRespondentController,
  AdminSurveySubmissionController,
  TaskController,
  PermissionController,
  RoleController,
} from '@intake24/api/http/controllers';
import type {
  AdminCategoryService,
  AdminFoodService,
  AdminSurveyService,
  AdminUserService,
  AuthenticationService,
  ACLService,
  JwtService,
  JwtRotationService,
  SignInService,
  AsServedService,
  FeedbackService,
  GuideImageService,
  ImageMapService,
  PortionSizeService,
  ProcessedImageService,
  SourceImageService,
  FoodDataService,
  LanguageService,
  NutrientTableService,
  DataExportFields,
  DataExportMapper,
  DataExportService,
  SurveyService,
  UserService,
  Cache,
  Filesystem,
  Mailer,
  Pusher,
  RateLimiter,
  Scheduler,
  Session,
  // MFA Providers
  MFAProvider,
} from '@intake24/api/services';
import type { JobsQueueHandler, TasksQueueHandler } from '@intake24/api/services/core/queues';
import type { Jobs } from '@intake24/api/jobs';
import type { User } from '@intake24/db';
import type { Environment } from '@intake24/common/types';
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
  currentUser: User;
  userId: string;

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
  localeController: LocaleController;
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
  aclService: ACLService;
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
  nutrientTableService: NutrientTableService;

  feedbackService: FeedbackService;

  // Foods
  foodDataService: FoodDataService;
  portionSizeService: PortionSizeService;

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
