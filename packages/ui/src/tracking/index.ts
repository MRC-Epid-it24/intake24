import { useGtm } from '@gtm-support/vue-gtm';

export const GtmEvents = {
  NoMoreInformation: 'noMoreInformation',
  Review: 'review',
  AddFood: 'addFood',
  AddMeal: 'addMeal',
  ChangeFood: 'changeFood',
  DeleteFood: 'deleteFood',
  DeleteMeal: 'deleteMeal',
  EditFood: 'editFood',
  EditMeal: 'editMeal',
  MealTime: 'mealTime',
  SelectFood: 'selectFood',
  SelectMeal: 'selectMeal',
  SelectFoodCategory: 'selectFoodCategory', // it is a action not found in action type
  Next: 'next',
  Restart: 'restart',
} as const;
export type GtmEvent = typeof GtmEvents[keyof typeof GtmEvents];

// Event category for Google Analytics, deduced from Scheme prompts structure
export const GtmSchemePrompts = {
  PreMeals: 'preMeals',
  PostMeals: 'postMeals',
  Submission: 'submission',
  PreFoods: 'preFoods',
  Foods: 'foods',
  PostFoods: 'postFoods',
  FoodsDeferred: 'foodsDeferred',
} as const;
export type GtmSchemePrompt = typeof GtmSchemePrompts[keyof typeof GtmSchemePrompts];

export type GtmEventParams = {
  event?: GtmEvent; // event type, e.g. GtmEvents.DeleteMeal, which is 'deleteMeal'. Open to new event types
  scheme_prompts?: GtmSchemePrompt; // e.g. GtmSchemePrompt.Submission, which is 'preMeals'
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
