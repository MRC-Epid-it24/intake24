import acl from './acl';
import user from './user';

import job from './job.controller';
import language from './language.controller';
import locale from './locale.controller';
import scheme from './scheme.controller';
import surveyDataExport from './survey-data-export.controller';
import surveyMgmt from './survey-mgmt.controller';
import surveyRespondent from './survey-respondent.controller';
import surveySubmission from './survey-submission.controller';
import survey from './survey.controller';
import task from './task.controller';

export * from './acl';
export * from './user';

export * from './job.controller';
export * from './language.controller';
export * from './locale.controller';
export * from './scheme.controller';
export * from './survey-data-export.controller';
export * from './survey-mgmt.controller';
export * from './survey-respondent.controller';
export * from './survey-submission.controller';
export * from './survey.controller';
export * from './task.controller';

export default {
  acl,
  user,

  job,
  language,
  locale,
  scheme,
  surveyDataExport,
  surveyMgmt,
  surveyRespondent,
  surveySubmission,
  survey,
  task,
};
