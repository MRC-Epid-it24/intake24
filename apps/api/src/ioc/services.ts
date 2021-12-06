import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
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
  logger,
  Mailer,
  Pusher,
  Scheduler,
  Session,
  adminSurveyService,
  adminUserService,
  asServedService,
  guideImageService,
  imageMapService,
  processedImageService,
  sourceImageService,
  nutrientTableService,
  foodDataService,
  portionSizeService,
  surveyService,
  userService,
} from '@api/services';

import { JobsQueueHandler, TasksQueueHandler } from '@api/services/core/queues';

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

    foodDataService: asFunction(foodDataService),
    nutrientTableService: asFunction(nutrientTableService),
    portionSizeService: asFunction(portionSizeService),

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
    scheduler: asClass(Scheduler).singleton(),
    session: asClass(Session).singleton(),

    jobsQueueHandler: asClass(JobsQueueHandler).singleton(),
    tasksQueueHandler: asClass(TasksQueueHandler).singleton(),
  });
};
