import { asClass, asFunction, asValue, AwilixContainer } from 'awilix';
import authenticationService from '@/services/auth/authentication.service';
import jwtService from '@/services/auth/jwt.service';
import jwtRotationService from '@/services/auth/jwt-rotation.service';
import signInService from '@/services/auth/sign-in.service';

import portionSizeService from '@/services/foods/portion-size.service';
import surveyService from '@/services/survey.service';
import dataExportService from '@/services/data-export/data-export.service';
import userService from '@/services/user.service';

import filesystem from '@/services/filesystem';
import logger from '@/services/logger';
import mailer from '@/services/mailer';
import scheduler from '@/services/scheduler';

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
    dataExportService: asFunction(dataExportService).singleton(),
    userService: asFunction(userService).singleton(),

    filesystem: asClass(filesystem).singleton(),
    logger: asValue(logger),
    mailer: asClass(mailer).singleton(),
    scheduler: asClass(scheduler).singleton(),

    jobsQueueHandler: asClass(jobsQueueHandler).singleton(),
    tasksQueueHandler: asClass(tasksQueueHandler).singleton(),
  });
};
