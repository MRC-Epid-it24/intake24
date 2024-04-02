import { authentication } from './authentication.router';
import { job } from './job.router';
import { nutrientTable } from './nutrient-table.router';
import { nutrientType } from './nutrient-type.router';
import { nutrientUnit } from './nutrient-unit.router';
import { signInLog } from './sign-in-log.router';
import { signUp } from './sign-up.router';
import { standardUnit } from './standard-unit.router';
import survey from './survey';
import { task } from './task.router';
import user from './user';

export default {
  authentication,
  job,
  nutrientTable,
  nutrientType,
  nutrientUnit,
  signInLog,
  signUp,
  standardUnit,
  survey,
  task,
  user,
};
