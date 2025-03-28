import { useGtm } from '@gtm-support/vue-gtm';
import { actionTypes } from '@intake24/common/prompts';

export const gtmEvents = [
  ...actionTypes,
  'noMoreInformation',
  'selectFoodCategory',
  'restart',
] as const;
type GtmEvent = (typeof gtmEvents)[number];

// Event category for Google Analytics, deduced from Scheme prompts structure
export const gtmSchemePrompts = [
  'preMeals',
  'postMeals',
  'submission',
  'preFoods',
  'foods',
  'postFoods',
  'foodsDeferred',
] as const;
export type GtmSchemePrompt = typeof gtmSchemePrompts[number];

export type GtmEventParams = {
  event?: GtmEvent | string; // event type, e.g. GtmEvents.DeleteMeal, which is 'deleteMeal'. Open to new event types
  scheme_prompts?: GtmSchemePrompt | string; // e.g. GtmSchemePrompt.Submission, which is 'preMeals'
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
