import category from './category.controller';
import fdb from './fdb.controller';
import food from './food.controller';
import foodGroup from './food-group.controller';
import globalFoods from './global-foods.controller';
import localFoods from './local-foods.controller';

export * from './category.controller';
export * from './fdb.controller';
export * from './food.controller';
export * from './food-group.controller';
export * from './global-foods.controller';
export * from './local-foods.controller';

export default {
  fdb,
  food,
  foodGroup,
  category,
  globalFoods,
  localFoods,
};
