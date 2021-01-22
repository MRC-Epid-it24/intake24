import job from './job.controller';
import language from './language.controller';
import locale from './locale.controller';
import profile from './profile.controller';
import scheme from './scheme.controller';
import surveyDataExport from './survey-data-export.controller';
import surveyMgmt from './survey-mgmt.controller';
import surveyRespondent from './survey-respondent.controller';
import surveySubmission from './survey-submission.controller';
import survey from './survey.controller';
import task from './task.controller';

import permission from './permission.controller';
import role from './role.controller';
import user from './user.controller';

export * from './job.controller';
export * from './language.controller';
export * from './locale.controller';
export * from './profile.controller';
export * from './scheme.controller';
export * from './survey-data-export.controller';
export * from './survey-mgmt.controller';
export * from './survey-respondent.controller';
export * from './survey-submission.controller';
export * from './survey.controller';
export * from './task.controller';

export * from './permission.controller';
export * from './role.controller';
export * from './user.controller';

export default {
  job,
  language,
  locale,
  permission,
  profile,
  role,
  scheme,
  surveyDataExport,
  surveyMgmt,
  surveyRespondent,
  surveySubmission,
  survey,
  task,
  user,
};
