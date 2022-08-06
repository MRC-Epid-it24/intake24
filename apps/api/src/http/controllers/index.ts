import admin from './admin';
import authentication from './authentication.controller';
import categories from './categories.controller';
import feedback from './feedback.controller';
import food from './food.controller';
import foodSearch from './food-search.controller';
import i18n from './i18n.controller';
import password from './password.controller';
import portionSize from './portion-size.controller';
import subscription from './subscription.controller';
import survey from './survey.controller';
import surveyRespondent from './survey-respondent.controller';
import user from './user';

export * from './admin';
export * from './authentication.controller';
export * from './categories.controller';
export * from './controller';
export * from './feedback.controller';
export * from './food.controller';
export * from './food-search.controller';
export * from './i18n.controller';
export * from './password.controller';
export * from './portion-size.controller';
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
  categories,
  i18n,
  portionSize,
  subscription,
  survey,
  surveyRespondent,
  user,
};
