import { useGtm } from '@gtm-support/vue-gtm';

export enum GtmEvent {
  NoMoreInformation = 'noMoreInformation',
  Review = 'review',
  AddFood = 'addFood',
  AddMeal = 'addMeal',
  ChangeFood = 'changeFood',
  DeleteFood = 'deleteFood',
  DeleteMeal = 'deleteMeal',
  EditFood = 'editFood',
  EditMeal = 'editMeal',
  MealTime = 'mealTime',
  SelectFood = 'selectFood',
  SelectMeal = 'selectMeal',
  SelectFoodCategory = 'selectFoodCategory', // it is a action not found in action type
  Next = 'next',
  Restart = 'restart',
}

// Event category for Google Analytics, deduced from Scheme prompts structure
export enum GtmSchemePrompts {
  PreMeals = 'preMeals',
  PostMeals = 'postMeals',
  Submission = 'submission',
  PreFoods = 'preFoods',
  Foods = 'foods',
  PostFoods = 'postFoods',
  FoodsDeferred = 'foodsDeferred',
}

export type GtmEventParams = {
  event: GtmEvent | string; // event type, e.g. deleteMeal
  scheme_prompts?: GtmSchemePrompts; // event category, e.g. preMeals
  meal?: string;
  food?: string; // food name, e.g. "Fresh fruit salad"
  food_category?: string; // food category, e.g. "Ham / gammon"
  action?: string; // specify action for interactive custom events (optional)
  prompt_id?: string; // type of prompt, e.g. "meal-add-prompt"
  label?: string; // auxillary data for custom events
  search_term?: string;
  search_count?: number;
  percent_scrolled?: number; // 0-100 percent scrolled refers to the percentage of the page that has been viewed so far
  noninteraction: boolean; // false if an event is not tracked as a user-generated action
};

export function sendGtmEvent(params: GtmEventParams): void {
  useGtm()?.trackEvent(params);
}
