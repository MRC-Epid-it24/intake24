import survey from './survey.controller';
import respondent from './survey-respondent.controller';
import submission from './survey-submission.controller';

export * from './survey.controller';
export * from './survey-respondent.controller';
export * from './survey-submission.controller';

export default {
  survey,
  respondent,
  submission,
};
