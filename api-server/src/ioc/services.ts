import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import {
  authenticationService,
  aclService,
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
  asServedService,
  guideImageService,
  imageMapService,
  processedImageService,
  sourceImageService,
  portionSizeService,
  foodDataService,
  surveyService,
  userService,
} from '@/services';

import { JobsQueueHandler, TasksQueueHandler } from '@/services/queues';

export default (container: AwilixContainer): void => {
  container.register({
    authenticationService: asFunction(authenticationService),
    aclService: asFunction(aclService).scoped(),
    jwtService: asFunction(jwtService),
    jwtRotationService: asFunction(jwtRotationService),
    signInService: asFunction(signInService),

    asServedService: asFunction(asServedService),
    guideImageService: asFunction(guideImageService),
    imageMapService: asFunction(imageMapService),
    processedImageService: asFunction(processedImageService),
    sourceImageService: asFunction(sourceImageService),
    portionSizeService: asFunction(portionSizeService),
    foodDataService: asFunction(foodDataService),
    surveyService: asFunction(surveyService),
    userService: asFunction(userService),

    dataExportFields: asFunction(dataExportFields),
    dataExportMapper: asFunction(dataExportMapper),
    dataExportService: asFunction(dataExportService),

    cache: asClass(Cache).singleton(),
    filesystem: asClass(Filesystem).singleton(),
    logger: asValue(logger),
    mailer: asClass(Mailer).singleton(),
    pusher: asClass(Pusher).singleton(),
    scheduler: asClass(Scheduler).singleton(),

    jobsQueueHandler: asClass(JobsQueueHandler).singleton(),
    tasksQueueHandler: asClass(TasksQueueHandler).singleton(),
  });
};
