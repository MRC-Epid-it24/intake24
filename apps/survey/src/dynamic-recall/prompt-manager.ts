import type { ComponentType, Condition, Prompt } from '@intake24/common/prompts';
import type { MealSection, SurveyQuestionSection } from '@intake24/common/surveys';
import type { FoodState, MealState } from '@intake24/common/types';
import type { SchemeEntryResponse } from '@intake24/common/types/http';
import { conditionOps } from '@intake24/common/prompts';
import {
  findMeal,
  foodPortionSizeComplete,
  getFoodByIndex,
  getFoodIndexRequired,
  mealAssociatedFoodsComplete,
  mealPortionSizeComplete,
  surveyFreeEntryComplete,
} from '@intake24/survey/util';

import type { SurveyState, SurveyStore } from '../stores';
import { recallLog } from '../stores';
import { resolveMealGaps } from '../util';
import {
  asServedComplete,
  cerealComplete,
  drinkScaleComplete,
  guideImageComplete,
  milkInAHotDrinkComplete,
  milkOnCerealComplete,
  missingFoodComplete,
  pizzaComplete,
  portionSizeMethodSelected,
  standardPortionComplete,
} from './portion-size-checks';

const foodEnergy = (energy: number, food: FoodState): number => {
  if (food.type !== 'encoded-food' || !food.portionSize) return energy;

  const {
    portionSize: { leftoversWeight, servingWeight },
    data: { kcalPer100g },
  } = food;
  if (leftoversWeight === null || servingWeight === null) return energy;

  energy += (kcalPer100g * (servingWeight - leftoversWeight)) / 100;

  if (food.linkedFoods.length) energy += food.linkedFoods.reduce(foodEnergy, energy);

  return energy;
};

const mealEnergy = (energy: number, meal: MealState): number =>
  meal.foods.reduce(foodEnergy, energy);

const surveyEnergy = (energy: number, meals: MealState[]): number =>
  meals.reduce(mealEnergy, energy);

const foodDrinks = (count: number, food: FoodState): number =>
  food.type === 'encoded-food' && food.data.categories.includes('DRNK') ? ++count : count;

const mealDrinks = (count: number, meal: MealState): number => meal.foods.reduce(foodDrinks, count);

const surveyDrinks = (count: number, meals: MealState[]): number => meals.reduce(mealDrinks, count);

const checkRecallNumber = (store: SurveyStore, condition: Condition) => {
  if (!store.user) {
    console.error('User information should not be null at this point');
    return false;
  }
  return conditionOps[condition.op]({ answer: store.user.submissions + 1, value: condition.value });
};

const showPrompt = (state: SurveyState, prompt: Prompt, component: ComponentType) =>
  prompt.component === component;

const checkSurveyStandardConditions = (state: SurveyState, prompt: Prompt): boolean => {
  const { component } = prompt;

  switch (component) {
    case 'info-prompt':
      return !state.data.flags.includes(`${prompt.id}-acknowledged`);
    case 'submit-prompt':
      return !state.data.endTime;
    case 'meal-add-prompt':
      return false;
    case 'meal-gap-prompt': {
      const [firstMeal, lastMeal] = resolveMealGaps(state.data.meals, prompt);

      if (firstMeal && lastMeal) {
        recallLog().promptCheck(component, true, 'Meal with between gap');
        return true;
      }

      if (firstMeal) {
        recallLog().promptCheck(component, true, 'Meal with start gap');
        return true;
      }

      if (lastMeal) {
        recallLog().promptCheck(component, true, 'Meal with end gap');
        return true;
      }

      recallLog().promptCheck(component, false, 'No meal gap');
      return false;
    }
    case 'review-confirm-prompt':
      return false;
    default:
      return state.data.customPromptAnswers[prompt.id] === undefined;
  }
};

const checkSurveyCustomConditions = (store: SurveyStore, prompt: Prompt) =>
  prompt.conditions.every((condition) => {
    const { op, props, type, value } = condition;

    switch (type) {
      case 'drinks': {
        if (props.section === 'survey')
          return conditionOps[op]({ value, answer: surveyDrinks(0, store.data.meals) });

        console.error(`Unexpected condition: ${type} & ${props.section}`);
        return false;
      }
      case 'energy': {
        if (props.section === 'survey')
          return conditionOps[op]({ value, answer: surveyEnergy(0, store.data.meals) });

        console.error(`Unexpected condition: ${type} & ${props.section}`);
        return false;
      }
      case 'promptAnswer': {
        if (props.section === 'survey')
          return conditionOps[op]({
            value,
            answer: store.data.customPromptAnswers[props.promptId],
          });

        console.error(`Unexpected condition: ${type} & ${props.section}`);
        return false;
      }
      case 'recallNumber':
        return checkRecallNumber(store, condition);
      default:
        console.error(`Unexpected condition type: ${condition}`);
        return false;
    }
  });

const checkMealStandardConditions = (
  surveyState: SurveyState,
  mealState: MealState,
  prompt: Prompt
): boolean => {
  switch (prompt.component) {
    case 'edit-meal-prompt':
      return mealState.foods.length === 0;
    case 'info-prompt':
      return !mealState.flags.includes(`${prompt.id}-acknowledged`);
    case 'meal-time-prompt':
      if (!mealState.time) {
        recallLog().promptCheck('meal-time-prompt', true, 'time is undefined');
        return true;
      }

      recallLog().promptCheck('meal-time-prompt', false, 'time is defined');
      return false;
    case 'no-more-information-prompt':
      if (surveyState.data.selection.mode === 'manual') {
        recallLog().promptCheck(
          'no-more-information-prompt',
          true,
          `Manual: no more prompts left for ${mealState.name.en}`
        );
        return true;
      }

      recallLog().promptCheck(
        'no-more-information-prompt',
        false,
        `Auto: no more prompts left for ${mealState.name.en}`
      );
      return false;
    case 'ready-meal-prompt':
      return !mealState.flags.includes('ready-meal-complete');
    default:
      return mealState.customPromptAnswers[prompt.id] === undefined;
  }
};

const checkMealCustomConditions = (store: SurveyStore, mealState: MealState, prompt: Prompt) =>
  prompt.conditions.every((condition) => {
    const { op, props, type, value } = condition;

    switch (type) {
      case 'drinks': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({ value, answer: surveyDrinks(0, store.data.meals) });
          case 'meal':
            return conditionOps[op]({ value, answer: mealDrinks(0, mealState) });
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'energy': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({ value, answer: surveyEnergy(0, store.data.meals) });
          case 'meal':
            return conditionOps[op]({ value, answer: mealEnergy(0, mealState) });
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'promptAnswer': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({
              value,
              answer: store.data.customPromptAnswers[props.promptId],
            });
          case 'meal':
            return conditionOps[op]({
              value,
              answer: mealState.customPromptAnswers[props.promptId],
            });
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'recallNumber':
        return checkRecallNumber(store, condition);
      default:
        console.error(`Unexpected condition type: ${condition}`);
        return false;
    }
  });

const checkFoodStandardConditions = (
  surveyState: SurveyState,
  foodState: FoodState,
  prompt: Prompt
): boolean => {
  const { component } = prompt;
  switch (component) {
    case 'info-prompt': {
      if (foodState.flags.includes(`${prompt.id}-acknowledged`)) {
        recallLog().promptCheck('info-prompt', false, `${prompt.id}-acknowledged flag set`);
        return false;
      }
      recallLog().promptCheck('info-prompt', true, `${prompt.id}-acknowledged flag not set`);
      return true;
    }

    case 'food-search-prompt': {
      const freeEntryComplete = surveyFreeEntryComplete(surveyState.data);

      if (['encoded-food', 'missing-food'].includes(foodState.type)) {
        recallLog().promptCheck(
          component,
          false,
          `Selected food entry type is ${foodState.type}, free entry complete: ${freeEntryComplete}`
        );
        return false;
      }

      if (surveyState.data.selection.mode === 'manual') {
        recallLog().promptCheck(
          component,
          true,
          'Selected food entry type is free-text and selection mode is manual'
        );
        return true;
      }

      if (freeEntryComplete) {
        recallLog().promptCheck(
          component,
          true,
          'Selected food entry type is free-text and all meals have free-entry-complete flag set'
        );
        return true;
      }

      recallLog().promptCheck(
        component,
        false,
        `Selected food entry type is ${foodState.type}, free entry complete: ${freeEntryComplete}`
      );
      return false;
    }

    case 'split-food-prompt': {
      const freeEntryComplete = surveyFreeEntryComplete(surveyState.data);

      if (
        foodState.type === 'free-text' &&
        freeEntryComplete &&
        !foodState.flags.includes('split-food-complete')
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Selected food entry type is free-text and all meals have free-entry-complete flag set'
        );
        return true;
      }

      recallLog().promptCheck(
        component,
        false,
        `Selected food entry type is ${foodState.type}, free entry complete: ${freeEntryComplete}`
      );
      return false;
    }

    case 'same-as-before-prompt': {
      if (
        foodState.type === 'encoded-food' &&
        !foodState.flags.includes('same-as-before-complete') &&
        !foodState.portionSize
      ) {
        recallLog().promptCheck(
          component,
          true,
          `Entry type is ${foodState.type}, no SAB flag yet and no portion size selected`
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        `Entry type is ${foodState.type}, SAB flag set or portion size selected`
      );
      return false;
    }

    case 'portion-size-option-prompt': {
      if (
        foodState.type === 'encoded-food' &&
        (foodState.portionSizeMethodIndex === null ||
          !foodState.flags.includes('portion-size-option-complete'))
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Entry type is encoded-food and no portion size method is selected'
        );
        return true;
      }

      recallLog().promptCheck(
        component,
        false,
        foodState.type === 'encoded-food'
          ? 'Portion size method already selected'
          : 'Entry type is not encoded-food'
      );
      return false;
    }

    case 'as-served-prompt': {
      if (portionSizeMethodSelected(foodState, 'as-served') && !asServedComplete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'As served portion size method selected but yet not complete'
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'as-served')
          ? 'As served portion size estimation not selected'
          : 'As served portion size estimation already complete'
      );
      return false;
    }

    case 'cereal-prompt': {
      if (portionSizeMethodSelected(foodState, 'cereal') && !cerealComplete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'Cereal portion size method selected but yet not complete'
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'cereal')
          ? 'Cereal portion size estimation not selected'
          : 'Cereal portion size estimation already complete'
      );
      return false;
    }

    case 'guide-image-prompt': {
      if (portionSizeMethodSelected(foodState, 'guide-image') && !guideImageComplete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'Guide image selected but estimation not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'guide-image')
          ? 'Guide image estimation already complete'
          : 'Guide image estimation not selected'
      );
      return false;
    }

    case 'drink-scale-prompt': {
      if (portionSizeMethodSelected(foodState, 'drink-scale') && !drinkScaleComplete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'Drink Scale selected but estimation not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'drink-scale')
          ? 'Drink Scale estimation already complete'
          : 'Drink Scale estimation not selected'
      );
      return false;
    }

    case 'milk-in-a-hot-drink-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'milk-in-a-hot-drink') &&
        !milkInAHotDrinkComplete(foodState)
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Milk in hot drink selected but estimation not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'milk-in-a-hot-drink')
          ? 'Milk in hot drink estimation already complete'
          : 'Milk in hot drink estimation not selected'
      );
      return false;
    }

    case 'milk-on-cereal-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'milk-on-cereal') &&
        !milkOnCerealComplete(foodState)
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Milk on cereal selected but estimation not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'milk-on-cereal')
          ? 'Milk on cereal estimation already complete'
          : 'Milk on cereal estimation not selected'
      );
      return false;
    }

    case 'pizza-prompt': {
      if (portionSizeMethodSelected(foodState, 'pizza') && !pizzaComplete(foodState)) {
        recallLog().promptCheck(component, true, 'Pizza selected but estimation not yet complete');
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'pizza')
          ? 'Pizza estimation already complete'
          : 'Pizza estimation not selected'
      );
      return false;
    }

    case 'standard-portion-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'standard-portion') &&
        !standardPortionComplete(foodState)
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Standard portion estimation selected but not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'standard-portion')
          ? 'Standard portion estimation already complete'
          : 'Standard portion estimation not selected'
      );
      return false;
    }

    case 'associated-foods-prompt': {
      if (foodState.type !== 'encoded-food') return false;
      if (!foodPortionSizeComplete(foodState)) return false;

      const foodIndex = getFoodIndexRequired(surveyState.data.meals, foodState.id);

      // Do not trigger associated food prompts for foods that are linked to another food to
      // avoid prompt loops
      if (foodIndex.linkedFoodIndex !== undefined) return false;

      return (
        foodState.data.associatedFoodPrompts.length !== 0 && !foodState.associatedFoodsComplete
      );
    }

    case 'no-more-information-prompt': {
      if (surveyState.data.selection.mode === 'manual') {
        if (surveyState.data.selection.element?.type === 'meal') {
          recallLog().promptCheck(
            component,
            true,
            `Manual: no more prompts left for ${foodState.id} in this Meal`
          );
          return false;
        } else {
          recallLog().promptCheck(
            component,
            true,
            `Manual: no more prompts left for ${foodState.id}`
          );
          return true;
        }
      } else {
        recallLog().promptCheck(component, false, `Auto: no more prompts left for ${foodState.id}`);
        return false;
      }
    }

    case 'missing-food-prompt': {
      if (foodState.type !== 'missing-food') return false;

      if (missingFoodComplete(foodState)) {
        recallLog().promptCheck(component, false, `Missing food info entered.`);
        return false;
      }

      recallLog().promptCheck(component, true, `Missing food info not entered yet..`);
      return true;
    }

    default: {
      if (foodState.customPromptAnswers[prompt.id] === undefined) {
        recallLog().promptCheck(
          prompt.component,
          true,
          `Custom prompt answer ${prompt.id} is undefined`
        );
        return true;
      }
      recallLog().promptCheck(
        prompt.component,
        false,
        `Custom prompt answer ${prompt.id} is defined`
      );
      return false;
    }
  }
};

const checkFoodCustomConditions = (
  store: SurveyStore,
  mealState: MealState,
  foodState: FoodState,
  prompt: Prompt
) =>
  prompt.conditions.every((condition) => {
    const { op, props, type, value } = condition;

    switch (type) {
      case 'drinks': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({ value, answer: surveyDrinks(0, store.data.meals) });
          case 'meal':
            return conditionOps[op]({ value, answer: mealDrinks(0, mealState) });
          case 'food':
            return conditionOps[op]({ value, answer: foodDrinks(0, foodState) });
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'energy': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({ value, answer: surveyEnergy(0, store.data.meals) });
          case 'meal':
            return conditionOps[op]({ value, answer: mealEnergy(0, mealState) });
          case 'food':
            return conditionOps[op]({ value, answer: foodEnergy(0, foodState) });
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'promptAnswer': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({
              value,
              answer: store.data.customPromptAnswers[props.promptId],
            });
          case 'meal':
            return conditionOps[op]({
              value,
              answer: mealState.customPromptAnswers[props.promptId],
            });
          case 'food':
            return conditionOps[op]({
              value,
              answer: foodState.customPromptAnswers[props.promptId],
            });
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'recallNumber':
        return checkRecallNumber(store, condition);
      case 'foodCategory': {
        if (foodState.type !== 'encoded-food') return false;
        return conditionOps[op]({ value, answer: foodState.data.categories });
      }
      default:
        console.error(`Unexpected condition type: ${condition}`);
        return false;
    }
  });

export default class PromptManager {
  private scheme;

  private store;

  constructor(store: SurveyStore, scheme: SchemeEntryResponse) {
    this.scheme = scheme;
    this.store = store;
  }

  findMealPromptOfType(type: ComponentType, section: MealSection): Prompt | undefined {
    return this.scheme.questions.meals[section].find((question) => question.component === type);
  }

  findSurveyPromptOfType(type: ComponentType, section: SurveyQuestionSection): Prompt | undefined {
    return this.scheme.questions[section].find((question) => question.component === type);
  }

  nextSurveySectionPrompt(section: SurveyQuestionSection): Prompt | undefined {
    return this.scheme.questions[section].find(
      (question) =>
        checkSurveyStandardConditions(this.store.$state, question) &&
        checkSurveyCustomConditions(this.store, question)
    );
  }

  nextMealSectionPrompt(section: MealSection, mealId: string): Prompt | undefined {
    const state = this.store.$state;
    const mealState = findMeal(state.data.meals, mealId);

    // Post foods prompts should only be triggered when all food data is collected
    // TODO: Probably should include food custom questions as well
    if (section === 'postFoods') {
      const meal = findMeal(state.data.meals, mealId);
      if (!(mealPortionSizeComplete(meal) && mealAssociatedFoodsComplete(meal))) {
        // TODO: is this required?
        /* if (state.data.selection.mode === 'manual') {
          return this.scheme.questions.meals['postFoods'].find((question) => {
            return checkMealStandardConditions(state, mealState, question);
          });
        } */
        return undefined;
      }
    }

    return this.scheme.questions.meals[section].find(
      (question) =>
        checkMealStandardConditions(state, mealState, question) &&
        checkMealCustomConditions(this.store, mealState, question)
    );
  }

  nextFoodsPrompt(foodId: string): Prompt | undefined {
    const state = this.store.$state;

    const foodIndex = getFoodIndexRequired(state.data.meals, foodId);
    const foodState = getFoodByIndex(state.data.meals, foodIndex);
    const mealState = state.data.meals[foodIndex.mealIndex];

    return this.scheme.questions.meals.foods.find(
      (question) =>
        checkFoodStandardConditions(state, foodState, question) &&
        checkFoodCustomConditions(this.store, mealState, foodState, question)
    );
  }

  /**
   * Set next Prompt in the Survey based on the type of the prompt component
   * @param component type of the prompt component to find
   * @returns { PromptQuestion }
   */
  setNextPreMealsPrompt(component: ComponentType): Prompt | undefined {
    return this.scheme.questions.preMeals.find((question) =>
      showPrompt(this.store.$state, question, component)
    );
  }
}
