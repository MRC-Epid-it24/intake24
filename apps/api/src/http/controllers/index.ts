import admin from './admin';
import authentication from './authentication.controller';
import password from './password.controller';
import feedback from './feedback.controller';
import foodSearch from './food-search.controller';
import food from './food.controller';
import portionSize from './portion-size.controller';
import subscription from './subscription.controller';
import survey from './survey.controller';
import surveyRespondent from './survey-respondent.controller';
import user from './user';

export * from './admin';
export * from './controller';
export * from './authentication.controller';
export * from './feedback.controller';
export * from './food-search.controller';
export * from './food.controller';
export * from './portion-size.controller';
export * from './password.controller';
export * from './subscription.controller';
export * from './survey.controller';
export * from './survey-respondent.controller';
export * from './user';

export default {
  admin,
  authentication,
  password,
  feedback,
  foodSearch,
  food,
  portionSize,
  subscription,
  survey,
  surveyRespondent,
  user,
};
