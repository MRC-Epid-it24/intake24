import admin from './admin';
import authentication from './authentication.controller';
import password from './password.controller';
import foodSearch from './food-search.controller';
import food from './food.controller';
import portionSize from './portion-size.controller';
import survey from './survey.controller';

export * from './admin';
export * from './controller';
export * from './authentication.controller';
export * from './food-search.controller';
export * from './food.controller';
export * from './portion-size.controller';
export * from './password.controller';
export * from './survey.controller';

export default {
  admin,
  authentication,
  password,
  foodSearch,
  food,
  portionSize,
  survey,
};
