import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import {
  authenticationService,
  jwtService,
  jwtRotationService,
  signInService,
  dataExportFields,
  dataExportMapper,
  dataExportService,
  Filesystem,
  logger,
  Mailer,
  Scheduler,
  portionSizeService,
  foodDataService,
  surveyService,
  userService,
} from '@/services';

import { JobsQueueHandler, TasksQueueHandler } from '@/services/queues';

export default (container: AwilixContainer): void => {
  container.register({
    authenticationService: asFunction(authenticationService),
    jwtService: asFunction(jwtService),
    jwtRotationService: asFunction(jwtRotationService),
    signInService: asFunction(signInService),

    portionSizeService: asFunction(portionSizeService),
    foodDataService: asFunction(foodDataService),
    surveyService: asFunction(surveyService),
    userService: asFunction(userService),

    dataExportFields: asFunction(dataExportFields),
    dataExportMapper: asFunction(dataExportMapper),
    dataExportService: asFunction(dataExportService),

    filesystem: asClass(Filesystem).singleton(),
    logger: asValue(logger),
    mailer: asClass(Mailer).singleton(),
    scheduler: asClass(Scheduler).singleton(),

    jobsQueueHandler: asClass(JobsQueueHandler).singleton(),
    tasksQueueHandler: asClass(TasksQueueHandler).singleton(),
  });
};
