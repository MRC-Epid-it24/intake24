import acl from './acl';
import foods from './foods';
import images from './images';
import surveys from './surveys';
import user from './user';

import job from './job.controller';
import language from './language.controller';
import locale from './locale.controller';
import nutrientTable from './nutrient-table.controller';
import scheme from './scheme.controller';
import schemeQuestion from './scheme-question.controller';
import signInLog from './sign-in-log.controller';
import task from './task.controller';

export * from './acl';
export * from './foods';
export * from './images';
export * from './surveys';
export * from './user';

export * from './job.controller';
export * from './language.controller';
export * from './locale.controller';
export * from './nutrient-table.controller';
export * from './scheme.controller';
export * from './scheme-question.controller';
export * from './sign-in-log.controller';
export * from './task.controller';

export default {
  acl,
  user,
  foods,
  images,
  surveys,

  job,
  language,
  locale,
  nutrientTable,
  scheme,
  schemeQuestion,
  signInLog,
  task,
};
