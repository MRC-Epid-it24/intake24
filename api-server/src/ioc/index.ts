import { createContainer, asClass, asValue } from 'awilix';
import type { Logger } from 'winston';

import config from '@/config';
import type { Config, DatabaseConfig, Environment } from '@/config';
import db, { DbInterface } from '@/db';
import type {
  AuthenticationController,
  PasswordController,
  FoodController,
  FoodSearchController,
  PortionSizeController,
  SurveyController,
  JobController,
  LanguageController,
  LocaleController,
  ProfileController,
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
  JwtService,
  JwtRotationService,
  SignInService,
  PortionSizeService,
  FoodDataService,
  DataExportFields,
  DataExportMapper,
  DataExportService,
  SurveyService,
  UserService,
  Filesystem,
  Mailer,
  Scheduler,
} from '@/services';
import type { JobsQueueHandler, TasksQueueHandler } from '@/services/queues';
import type { Jobs } from '@/jobs';

import controllers from './controllers';
import jobs from './jobs';
import services from './services';

export interface IoC extends Jobs {
  environment: Environment;
  config: Config;
  databaseConfig: DatabaseConfig;
  db: DbInterface;
  filesystem: Filesystem;
  logger: Logger;
  mailer: Mailer;
  scheduler: Scheduler;

  // Controllers
  authenticationController: AuthenticationController;
  passwordController: PasswordController;

  // Public controllers
  foodController: FoodController;
  foodSearchController: FoodSearchController;
  portionSizeController: PortionSizeController;
  surveyController: SurveyController;

  // Admin controllers
  profileController: ProfileController;
  jobController: JobController;

  languageController: LanguageController;
  localeController: LocaleController;
  schemeController: SchemeController;
  adminSurveyController: AdminSurveyController;
  adminSurveyDataExportController: AdminSurveyDataExportController;
  adminSurveyMgmtController: AdminSurveyMgmtController;
  adminSurveyRespondentController: AdminSurveyRespondentController;
  adminSurveySubmissionController: AdminSurveySubmissionController;

  // System controllers
  taskController: TaskController;

  // ACL controllers
  permissionController: PermissionController;
  roleController: RoleController;
  userController: UserController;

  // Services
  authenticationService: AuthenticationService;
  jwtService: JwtService;
  jwtRotationService: JwtRotationService;
  signInService: SignInService;

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
  });

  controllers(container);
  services(container);
  jobs(container);

  return container;
};

export default configureContainer();
