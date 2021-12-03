import { createContainer, asClass, asValue } from 'awilix';
import type { Logger } from 'winston';

import config from '@api/config';
import type {
  ACLConfig,
  AppConfig,
  CacheConfig,
  Config,
  DatabaseConfig,
  Environment,
  FileSystemConfig,
  LogConfig,
  MailConfig,
  QueueConfig,
  SecurityConfig,
  ServicesConfig,
  SessionConfig,
} from '@api/config';
import db, { DbInterface } from '@api/db';
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
  UserController,
  // Admin
  UserProfileController,
  UserJobController,
  AsServedSetController,
  AsServedImageController,
  GuideImageController,
  ImageMapController,
  JobController,
  LanguageController,
  LocaleController,
  NutrientTableController,
  SchemeController,
  SchemeQuestionController,
  SignInLogController,
  AdminSurveyController,
  AdminSurveyDataExportController,
  AdminSurveyMgmtController,
  AdminSurveyRespondentController,
  AdminSurveySubmissionController,
  TaskController,
  PermissionController,
  RoleController,
  AdminUserController,
} from '@api/http/controllers';
import type {
  AdminSurveyService,
  AuthenticationService,
  ACLService,
  JwtService,
  JwtRotationService,
  SignInService,
  AsServedService,
  GuideImageService,
  ImageMapService,
  PortionSizeService,
  ProcessedImageService,
  SourceImageService,
  FoodDataService,
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
  Scheduler,
  Session,
  // MFA Providers
  MFAProvider,
} from '@api/services';
import type { JobsQueueHandler, TasksQueueHandler } from '@api/services/core/queues';
import type { Jobs } from '@api/jobs';

import type { User } from '@api/db/models/system';

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
  securityConfig: SecurityConfig;
  servicesConfig: ServicesConfig;
  sessionConfig: SessionConfig;
  // Expose some config settings directly to avoid pulling in the whole config when it doesn't
  // make sense, e.g. for testing
  environment: Environment;
  imagesBaseUrl: string;

  currentUser: User;

  // Controllers
  authenticationController: AuthenticationController;
  passwordController: PasswordController;
  subscriptionController: SubscriptionController;
  userController: UserController;

  // Survey controllers
  foodController: FoodController;
  foodSearchController: FoodSearchController;
  portionSizeController: PortionSizeController;
  surveyController: SurveyController;
  surveyRespondentController: SurveyRespondentController;

  // Feedback controllers
  feedbackController: FeedbackController;

  // Admin controllers
  userProfileController: UserProfileController;
  userJobController: UserJobController;

  asServedSetController: AsServedSetController;
  asServedImageController: AsServedImageController;
  guideImageController: GuideImageController;
  imageMapController: ImageMapController;
  languageController: LanguageController;
  localeController: LocaleController;
  nutrientTableController: NutrientTableController;
  schemeController: SchemeController;
  schemeQuestionController: SchemeQuestionController;
  adminSurveyController: AdminSurveyController;
  adminSurveyDataExportController: AdminSurveyDataExportController;
  adminSurveyMgmtController: AdminSurveyMgmtController;
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
  db: DbInterface;
  cache: Cache;
  filesystem: Filesystem;
  logger: Logger;
  mailer: Mailer;
  pusher: Pusher;
  scheduler: Scheduler;
  session: Session;

  // Authentication
  authenticationService: AuthenticationService;
  aclService: ACLService;
  jwtService: JwtService;
  jwtRotationService: JwtRotationService;
  signInService: SignInService;

  // MFA Providers
  mfaProvider: MFAProvider;

  // Images
  asServedService: AsServedService;
  guideImageService: GuideImageService;
  imageMapService: ImageMapService;
  processedImageService: ProcessedImageService;
  sourceImageService: SourceImageService;

  // Foods
  foodDataService: FoodDataService;
  nutrientTableService: NutrientTableService;
  portionSizeService: PortionSizeService;

  // Surveys
  adminSurveyService: AdminSurveyService;
  surveyService: SurveyService;
  dataExportFields: DataExportFields;
  dataExportMapper: DataExportMapper;
  dataExportService: DataExportService;

  userService: UserService;

  // Queues
  jobsQueueHandler: JobsQueueHandler;
  tasksQueueHandler: TasksQueueHandler;
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
    securityConfig: asValue(config.security),
    servicesConfig: asValue(config.services),
    sessionConfig: asValue(config.session),
    environment: asValue(config.app.env),
    imagesBaseUrl: asValue(config.app.urls.images),

    db: asClass(db).singleton(),
  });

  controllers(container);
  services(container);
  jobs(container);

  return container;
};

export default configureContainer();
