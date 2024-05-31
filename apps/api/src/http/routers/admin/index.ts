import acl from './acl';
import { permission } from './acl/permission.router';
import { role } from './acl/role.router';
import { authentication } from './authentication.router';
import { feedbackScheme } from './feedback-scheme.router';
import { foodDb } from './food-db.router';
import { foodGroup } from './food-group.router';
import { job } from './job.router';
import { language } from './language.router';
import { languageTranslation } from './language-translation.router';
import { nutrientTable } from './nutrient-table.router';
import { nutrientType } from './nutrient-type.router';
import { nutrientUnit } from './nutrient-unit.router';
import { securable } from './securable.router';
import { signInLog } from './sign-in-log.router';
import { signUp } from './sign-up.router';
import { standardUnit } from './standard-unit.router';
import survey from './survey';
import { task } from './task.router';
import user from './user';

export default {
  acl,
  authentication,
  feedbackScheme,
  foodDb,
  foodGroup,
  job,
  language,
  languageTranslation,
  nutrientTable,
  nutrientType,
  nutrientUnit,
  permission,
  role,
  securable,
  signInLog,
  signUp,
  standardUnit,
  survey,
  task,
  user,
};
