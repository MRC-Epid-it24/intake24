import { createContainer, asClass, asValue } from 'awilix';
import type { Logger } from 'winston';

import config from '@/config';
import type { Config, DatabaseConfig, Environment } from '@/config';
import db, { DbInterface } from '@/db';
import type {
  AuthenticationController,
  PasswordController,
  SubscriptionController,
  FoodController,
  FoodSearchController,
  PortionSizeController,
  SurveyController,
  SurveyRespondentController,
  // Admin
  UserProfileController,
  UserJobController,
  GuideImageController,
  ImageMapController,
  JobController,
  LanguageController,
  LocaleController,
  SchemeController,
  AdminSurveyController,
  AdminSurveyDataExportController,
  AdminSurveyMgmtController,
  AdminSurveyRespondentController,
  AdminSurveySubmissionController,
  TaskController,
  PermissionController,
  RoleController,
  UserController,
} from '@/http/controllers';
import type {
  AuthenticationService,
  ACLService,
  JwtService,
  JwtRotationService,
  SignInService,
  GuideImageService,
  ImageMapService,
  PortionSizeService,
  ProcessedImageService,
  SourceImageService,
  FoodDataService,
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
} from '@/services';
import type { JobsQueueHandler, TasksQueueHandler } from '@/services/queues';
import type { Jobs } from '@/jobs';

import type { User } from '@/db/models/system';

import controllers from './controllers';
import jobs from './jobs';
import services from './services';

export interface IoC extends Jobs {
  currentUser: User;

  environment: Environment;
  config: Config;
  db: DbInterface;
  cache: Cache;
  filesystem: Filesystem;
  logger: Logger;
  mailer: Mailer;
  pusher: Pusher;
  scheduler: Scheduler;

  // Expose some config settings directly to avoid pulling in the whole config when it doesn't
  // make sense, e.g. for testing
  databaseConfig: DatabaseConfig;
  imagesBaseUrl: string;

  // Controllers
  authenticationController: AuthenticationController;
  passwordController: PasswordController;
  subscriptionController: SubscriptionController;

  // Survey controllers
  foodController: FoodController;
  foodSearchController: FoodSearchController;
  portionSizeController: PortionSizeController;
  surveyController: SurveyController;
  surveyRespondentController: SurveyRespondentController;

  // Admin controllers
  userProfileController: UserProfileController;
  userJobController: UserJobController;

  guideImageController: GuideImageController;
  imageMapController: ImageMapController;
  languageController: LanguageController;
  localeController: LocaleController;
  schemeController: SchemeController;
  adminSurveyController: AdminSurveyController;
  adminSurveyDataExportController: AdminSurveyDataExportController;
  adminSurveyMgmtController: AdminSurveyMgmtController;
  adminSurveyRespondentController: AdminSurveyRespondentController;
  adminSurveySubmissionController: AdminSurveySubmissionController;

  // System controllers
  jobController: JobController;
  taskController: TaskController;

  // ACL controllers
  permissionController: PermissionController;
  roleController: RoleController;
  userController: UserController;

  // Services
  authenticationService: AuthenticationService;
  aclService: ACLService;
  jwtService: JwtService;
  jwtRotationService: JwtRotationService;
  signInService: SignInService;

  guideImageService: GuideImageService;
  imageMapService: ImageMapService;
  processedImageService: ProcessedImageService;
  sourceImageService: SourceImageService;

  portionSizeService: PortionSizeService;
  foodDataService: FoodDataService;
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
    environment: asValue(config.app.env),
    databaseConfig: asValue(config.database),
    db: asClass(db).singleton(),
    imagesBaseUrl: asValue(config.app.urls.images),
  });

  controllers(container);
  services(container);
  jobs(container);

  return container;
};

export default configureContainer();
