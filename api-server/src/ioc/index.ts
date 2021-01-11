import { createContainer, asClass, asValue } from 'awilix';
import type { Logger } from 'winston';

import config, { Config } from '@/config';
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
  AdminSurveyRespondentController,
  AdminSurveyMgmtController,
  TaskController,
  PermissionController,
  RoleController,
  UserController,
} from '@/http/controllers';

import type { AuthenticationService } from '@/services/auth/authentication.service';
import type { JwtService } from '@/services/auth/jwt.service';
import type { JwtRotationService } from '@/services/auth/jwt-rotation.service';
import type { SignInService } from '@/services/auth/sign-in.service';

import type { PortionSizeService } from '@/services/foods/portion-size.service';
import type { DataExportService } from '@/services/data-export/data-export.service';
import type { SurveyService } from '@/services/survey.service';
import type { UserService } from '@/services/user.service';

import type Filesystem from '@/services/filesystem';
import type Mailer from '@/services/mailer';
import type Scheduler from '@/services/scheduler';

import type JobsQueueHandler from '@/services/queues/jobs-queue-handler';
import type TasksQueueHandler from '@/services/queues/tasks-queue-handler';

import type { Jobs } from '@/jobs/job';

import { DatabaseConfig } from '@/config/database';
import { Environment } from '@/config/app';
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
  adminSurveyRespondentController: AdminSurveyRespondentController;
  adminSurveyMgmtController: AdminSurveyMgmtController;

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
  surveyService: SurveyService;
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
