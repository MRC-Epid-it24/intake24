import Food from './food';
import FoodAttribute from './food-attribute';
import FoodLocal from './food-local';
import Locale from './locale';
import FoodLocalList from "@/db/models/foods/food-local-list";

export default {
  Food,
  FoodAttribute,
  FoodLocal,
  FoodLocalLists: FoodLocalList,
  Locale,
};
