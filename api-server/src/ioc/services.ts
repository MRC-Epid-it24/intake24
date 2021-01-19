import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import {
  authenticationService,
  jwtService,
  jwtRotationService,
  signInService,
  dataExportFields,
  dataExportMapper,
  dataExportService,
  filesystem,
  logger,
  mailer,
  scheduler,
  portionSizeService,
  surveyService,
  userService,
} from '@/services';

import jobsQueueHandler from '@/services/queues/jobs-queue-handler';
import tasksQueueHandler from '@/services/queues/tasks-queue-handler';

export default (container: AwilixContainer): void => {
  container.register({
    authenticationService: asFunction(authenticationService).singleton(),
    jwtService: asFunction(jwtService).singleton(),
    jwtRotationService: asFunction(jwtRotationService).singleton(),
    signInService: asFunction(signInService).singleton(),

    portionSizeService: asFunction(portionSizeService).singleton(),
    surveyService: asFunction(surveyService).singleton(),
    userService: asFunction(userService).singleton(),

    dataExportFields: asFunction(dataExportFields).singleton(),
    dataExportMapper: asFunction(dataExportMapper).singleton(),
    dataExportService: asFunction(dataExportService).singleton(),

    filesystem: asClass(filesystem).singleton(),
    logger: asValue(logger),
    mailer: asClass(mailer).singleton(),
    scheduler: asClass(scheduler).singleton(),

    jobsQueueHandler: asClass(jobsQueueHandler).singleton(),
    tasksQueueHandler: asClass(tasksQueueHandler).singleton(),
  });
};
