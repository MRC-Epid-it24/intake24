import type { ComponentType, Condition, Conditions, Prompt } from '@intake24/common/prompts';
import type { MealSection, SurveyPromptSection } from '@intake24/common/surveys';
import type { FoodState, MealState, Selection } from '@intake24/common/types';
import type { SchemeEntryResponse } from '@intake24/common/types/http';
import type { PromptInstance } from '@intake24/survey/dynamic-recall/dynamic-recall';
import { conditionOps } from '@intake24/common/prompts';
import { mealSections, resolveMealGaps } from '@intake24/common/surveys';
import {
  findMeal,
  foodPortionSizeComplete,
  getFoodByIndex,
  getFoodIndexRequired,
  getMealIndexForSelection,
  mealComplete,
  mealPortionSizeComplete,
  missingFoodComplete,
  surveyFreeEntryComplete,
} from '@intake24/survey/util';

import type { SurveyState, SurveyStore } from '../stores';
import { recallLog } from '../stores';
import {
  asServedComplete,
  cerealComplete,
  directWeightComplete,
  drinkScaleComplete,
  guideImageComplete,
  milkInAHotDrinkComplete,
  milkOnCerealComplete,
  parentFoodPortionComplete,
  pizzaComplete,
  pizzaV2Complete,
  portionSizeMethodSelected,
  recipeBuilderComplete,
  standardPortionComplete,
} from './portion-size-checks';

function foodEnergy(energy: number, food: FoodState): number {
  if (food.linkedFoods.length)
    energy += food.linkedFoods.reduce(foodEnergy, energy);

  if (food.type !== 'encoded-food' || !food.portionSize)
    return energy;

  const {
    portionSize: { leftoversWeight, servingWeight },
    data: { kcalPer100g },
  } = food;
  if (leftoversWeight === null || servingWeight === null)
    return energy;

  energy += (kcalPer100g * (servingWeight - leftoversWeight)) / 100;

  return energy;
}

function mealEnergy(energy: number, meal: MealState): number {
  return meal.foods.reduce(foodEnergy, energy);
}

function surveyEnergy(energy: number, meals: MealState[]): number {
  return meals.reduce(mealEnergy, energy);
}

function foodDrinks(count: number, food: FoodState): number {
  if (food.linkedFoods.length)
    count += food.linkedFoods.reduce(foodDrinks, count);

  return food.type === 'encoded-food' && food.data.categories.includes('DRNK') ? ++count : count;
}

function mealDrinks(count: number, meal: MealState): number {
  return meal.foods.reduce(foodDrinks, count);
};

function surveyDrinks(count: number, meals: MealState[]): number {
  return meals.reduce(mealDrinks, count);
};

function propertyGetter(store: SurveyStore, property: 'recallNumber' | 'userName') {
  return ({
    recallNumber: store.recallNumber,
    userName: store.user?.name ?? null,
  })[property];
}

function checkProperty(store: SurveyStore, condition: Conditions['property']) {
  return conditionOps[condition.op]({
    answer: propertyGetter(store, condition.props.name),
    value: condition.value,
  });
}

function checkRecallNumber(store: SurveyStore, condition: Condition) {
  return conditionOps[condition.op]({ answer: store.recallNumber, value: condition.value });
}

function showPrompt(state: SurveyState, prompt: Prompt, component: ComponentType) {
  return prompt.component === component;
}

function checkSurveyStandardConditions(state: SurveyState, prompt: Prompt): boolean {
  const { component } = prompt;

  switch (component) {
    case 'info-prompt':
      return !state.data.flags.includes(`${prompt.id}-acknowledged`);
    case 'submit-prompt':
      return !state.data.endTime;
    case 'meal-add-prompt':
      return !state.data.meals.length;
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
    case 'multi-prompt':
      return prompt.prompts.some(item => checkSurveyStandardConditions(state, item));
    case 'review-confirm-prompt':
      return false;
    default:
      return state.data.customPromptAnswers[prompt.id] === undefined;
  }
}

function checkSurveyCustomConditions(store: SurveyStore, prompt: Prompt) {
  return prompt.conditions.every((condition) => {
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
      case 'flag': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({ value, answer: store.data.flags });
          case 'meal':
            return store.data.meals.every(({ flags }) =>
              conditionOps[op]({ value, answer: flags }),
            );
          case 'food':
            return store.data.meals.every(meal =>
              meal.foods.every(({ flags }) => conditionOps[op]({ value, answer: flags })),
            );
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'meals': {
        return conditionOps[op]({ value, answer: store.data.meals.length });
      }
      case 'promptAnswer': {
        if (props.section === 'survey') {
          return conditionOps[op]({
            value,
            answer: store.data.customPromptAnswers[props.promptId],
          });
        }

        console.error(`Unexpected condition: ${type} & ${props.section}`);
        return false;
      }
      case 'property':
        return checkProperty(store, condition);
      case 'recallNumber':
        return checkRecallNumber(store, condition);
      default:
        console.error(`Unexpected condition type: ${condition}`);
        return false;
    }
  });
}

function checkMealStandardConditions(surveyState: SurveyState, mealState: MealState, withSelection: Selection | null, prompt: Prompt): boolean {
  const selection = withSelection || surveyState.data.selection;

  switch (prompt.component) {
    case 'edit-meal-prompt':
      return mealState.foods.length === 0;
    case 'info-prompt':
      return !mealState.flags.includes(`${prompt.id}-acknowledged`);
    case 'meal-duration-prompt':
      if (mealState.duration === null) {
        recallLog().promptCheck('meal-duration-prompt', true, 'duration is null');
        return true;
      }

      recallLog().promptCheck('meal-duration-prompt', false, 'duration is defined');
      return false;
    case 'meal-time-prompt':
      if (!mealState.time) {
        recallLog().promptCheck('meal-time-prompt', true, 'time is undefined');
        return true;
      }

      recallLog().promptCheck('meal-time-prompt', false, 'time is defined');
      return false;
    case 'multi-prompt':
      return prompt.prompts.some(item =>
        checkMealStandardConditions(surveyState, mealState, withSelection, item),
      );
    case 'no-more-information-prompt':
      if (selection.mode === 'manual') {
        recallLog().promptCheck(
          'no-more-information-prompt',
          true,
          `Manual: no more prompts left for ${mealState.name.en}`,
        );
        return true;
      }

      recallLog().promptCheck(
        'no-more-information-prompt',
        false,
        `Auto: no more prompts left for ${mealState.name.en}`,
      );
      return false;
    case 'ready-meal-prompt':
      return !mealState.flags.includes('ready-meal-complete');
    default:
      return mealState.customPromptAnswers[prompt.id] === undefined;
  }
}

function checkMealCustomConditions(store: SurveyStore, mealState: MealState, prompt: Prompt) {
  return prompt.conditions.every((condition) => {
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
      case 'flag': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({ value, answer: store.data.flags });
          case 'meal':
            return conditionOps[op]({ value, answer: mealState.flags });
          case 'food':
            return mealState.foods.every(({ flags }) => conditionOps[op]({ value, answer: flags }));
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'meals': {
        return conditionOps[op]({ value, answer: store.data.meals.length });
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
      case 'property':
        return checkProperty(store, condition);
      case 'recallNumber':
        return checkRecallNumber(store, condition);
      default:
        console.error(`Unexpected condition type: ${condition}`);
        return false;
    }
  });
}

function checkFoodStandardConditions(surveyState: SurveyState, foodState: FoodState, withSelection: Selection | null, prompt: Prompt): boolean {
  const { component } = prompt;
  const selection = withSelection || surveyState.data.selection;

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

      if (['encoded-food', 'missing-food', 'recipe-builder'].includes(foodState.type)) {
        recallLog().promptCheck(
          component,
          false,
          `Selected food entry type is ${foodState.type}, free entry complete: ${freeEntryComplete}`,
        );
        return false;
      }

      if (selection.mode === 'manual') {
        recallLog().promptCheck(
          component,
          true,
          'Selected food entry type is free-text and selection mode is manual',
        );
        return true;
      }

      if (freeEntryComplete) {
        recallLog().promptCheck(
          component,
          true,
          'Selected food entry type is free-text and all meals have free-entry-complete flag set',
        );
        return true;
      }

      recallLog().promptCheck(
        component,
        false,
        `Selected food entry type is ${foodState.type}, free entry complete: ${freeEntryComplete}`,
      );
      return false;
    }

    case 'split-food-prompt': {
      const freeEntryComplete = surveyFreeEntryComplete(surveyState.data);

      if (
        foodState.type === 'free-text'
        && freeEntryComplete
        && !foodState.flags.includes('split-food-complete')
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Selected food entry type is free-text and all meals have free-entry-complete flag set',
        );
        return true;
      }

      recallLog().promptCheck(
        component,
        false,
        `Selected food entry type is ${foodState.type}, free entry complete: ${freeEntryComplete}`,
      );
      return false;
    }

    case 'same-as-before-prompt': {
      if (
        foodState.type === 'encoded-food'
        && !foodState.flags.includes('same-as-before-complete')
        && !foodState.portionSize
      ) {
        recallLog().promptCheck(
          component,
          true,
          `Entry type is ${foodState.type}, no SAB flag yet and no portion size selected`,
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        `Entry type is ${foodState.type}, SAB flag set or portion size selected`,
      );
      return false;
    }

    case 'portion-size-option-prompt': {
      if (
        foodState.type === 'encoded-food'
        && (foodState.portionSizeMethodIndex === null
        || !foodState.flags.includes('portion-size-option-complete'))
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Entry type is encoded-food and no portion size method is selected',
        );
        return true;
      }

      recallLog().promptCheck(
        component,
        false,
        foodState.type === 'encoded-food'
          ? 'Portion size method already selected'
          : 'Entry type is not encoded-food',
      );
      return false;
    }

    case 'as-served-prompt': {
      if (portionSizeMethodSelected(foodState, 'as-served') && !asServedComplete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'As served portion size method selected but yet not complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'as-served')
          ? 'As served portion size estimation not selected'
          : 'As served portion size estimation already complete',
      );
      return false;
    }

    case 'cereal-prompt': {
      if (portionSizeMethodSelected(foodState, 'cereal') && !cerealComplete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'Cereal portion size method selected but yet not complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'cereal')
          ? 'Cereal portion size estimation not selected'
          : 'Cereal portion size estimation already complete',
      );
      return false;
    }

    case 'guide-image-prompt': {
      if (portionSizeMethodSelected(foodState, 'guide-image') && !guideImageComplete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'Guide image selected but estimation not yet complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'guide-image')
          ? 'Guide image estimation already complete'
          : 'Guide image estimation not selected',
      );
      return false;
    }

    case 'direct-weight-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'direct-weight')
        && !directWeightComplete(foodState)
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Direct weight estimation selected but not yet complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'direct-weight')
          ? 'Direct weight estimation already complete'
          : 'Direct weight estimation not selected',
      );
      return false;
    }

    case 'drink-scale-prompt': {
      if (portionSizeMethodSelected(foodState, 'drink-scale') && !drinkScaleComplete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'Drink Scale selected but estimation not yet complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'drink-scale')
          ? 'Drink Scale estimation already complete'
          : 'Drink Scale estimation not selected',
      );
      return false;
    }

    case 'milk-in-a-hot-drink-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'milk-in-a-hot-drink')
        && !milkInAHotDrinkComplete(foodState)
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Milk in hot drink selected but estimation not yet complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'milk-in-a-hot-drink')
          ? 'Milk in hot drink estimation already complete'
          : 'Milk in hot drink estimation not selected',
      );
      return false;
    }

    case 'milk-on-cereal-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'milk-on-cereal')
        && !milkOnCerealComplete(foodState)
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Milk on cereal selected but estimation not yet complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'milk-on-cereal')
          ? 'Milk on cereal estimation already complete'
          : 'Milk on cereal estimation not selected',
      );
      return false;
    }

    case 'parent-food-portion-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'parent-food-portion')
        && !parentFoodPortionComplete(foodState)
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Parent food portion selected but estimation not yet complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'parent-food-portion')
          ? 'Parent food portion estimation already complete'
          : 'Parent food portion estimation not selected',
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
          : 'Pizza estimation not selected',
      );
      return false;
    }

    case 'pizza-v2-prompt': {
      if (portionSizeMethodSelected(foodState, 'pizza-v2') && !pizzaV2Complete(foodState)) {
        recallLog().promptCheck(
          component,
          true,
          'Pizza V2 selected but estimation not yet complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'pizza-v2')
          ? 'Pizza V2 estimation already complete'
          : 'Pizza V2 estimation not selected',
      );
      return false;
    }

    case 'standard-portion-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'standard-portion')
        && !standardPortionComplete(foodState)
      ) {
        recallLog().promptCheck(
          component,
          true,
          'Standard portion estimation selected but not yet complete',
        );
        return true;
      }
      recallLog().promptCheck(
        component,
        false,
        portionSizeMethodSelected(foodState, 'standard-portion')
          ? 'Standard portion estimation already complete'
          : 'Standard portion estimation not selected',
      );
      return false;
    }

    case 'associated-foods-prompt': {
      if (foodState.type !== 'encoded-food')
        return false;
      if (!foodPortionSizeComplete(foodState))
        return false;

      const mealIndex = getMealIndexForSelection(surveyState.data.meals, selection);

      if (mealIndex !== undefined && !mealPortionSizeComplete(surveyState.data.meals[mealIndex]))
        return false;

      return !!(
        foodState.data.associatedFoodPrompts.length
        && !foodState.flags.includes('associated-foods-complete')
      );
    }

    case 'no-more-information-prompt': {
      if (selection.mode === 'manual') {
        if (selection.element?.type === 'meal') {
          recallLog().promptCheck(
            component,
            true,
            `Manual: no more prompts left for ${foodState.id} in this Meal`,
          );
          return false;
        }
        else {
          recallLog().promptCheck(
            component,
            true,
            `Manual: no more prompts left for ${foodState.id}`,
          );
          return true;
        }
      }
      else {
        recallLog().promptCheck(component, false, `Auto: no more prompts left for ${foodState.id}`);
        return false;
      }
    }

    case 'missing-food-prompt': {
      if (foodState.type !== 'missing-food')
        return false;

      if (missingFoodComplete(foodState)) {
        recallLog().promptCheck(component, false, `Missing food info entered.`);
        return false;
      }

      recallLog().promptCheck(component, true, `Missing food info not entered yet..`);
      return true;
    }

    case 'multi-prompt':
      return prompt.prompts.some(item =>
        checkFoodStandardConditions(surveyState, foodState, withSelection, item),
      );

    case 'recipe-builder-prompt': {
      if (foodState.type !== 'recipe-builder')
        return false;

      if (recipeBuilderComplete(foodState)) {
        recallLog().promptCheck(component, false, `Recipe Builder food info entered.`);
        return false;
      }

      recallLog().promptCheck(component, true, `Recipe food info not entered yet..`);
      return true;
    }

    default: {
      if (foodState.customPromptAnswers[prompt.id] === undefined) {
        recallLog().promptCheck(
          prompt.component,
          true,
          `Custom prompt answer ${prompt.id} is undefined`,
        );
        return true;
      }
      recallLog().promptCheck(
        prompt.component,
        false,
        `Custom prompt answer ${prompt.id} is defined`,
      );
      return false;
    }
  }
}

function checkFoodCustomConditions(store: SurveyStore, mealState: MealState, foodState: FoodState, prompt: Prompt) {
  return prompt.conditions.every((condition) => {
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
      case 'flag': {
        switch (props.section) {
          case 'survey':
            return conditionOps[op]({ value, answer: store.data.flags });
          case 'meal':
            return conditionOps[op]({ value, answer: mealState.flags });
          case 'food':
            return conditionOps[op]({ value, answer: foodState.flags });
          default:
            console.error(`Unexpected condition: ${type} & ${props.section}`);
            return false;
        }
      }
      case 'foodCategory': {
        if (foodState.type !== 'encoded-food')
          return false;
        return conditionOps[op]({ value, answer: foodState.data.categories });
      }
      case 'meals': {
        return conditionOps[op]({ value, answer: store.data.meals.length });
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
      case 'property':
        return checkProperty(store, condition);
      case 'recallNumber':
        return checkRecallNumber(store, condition);
      default:
        console.error(`Unexpected condition type: ${condition}`);
        return false;
    }
  });
}

export default class PromptManager {
  private scheme;

  private store;

  constructor(store: SurveyStore, scheme: SchemeEntryResponse) {
    this.scheme = scheme;
    this.store = store;
  }

  findMealPromptById(promptId: string): PromptInstance | null {
    for (const section of mealSections) {
      const prompt = this.scheme.prompts.meals[section].find(p => p.id === promptId);
      if (prompt)
        return { section, prompt };
    }
    return null;
  }

  findFoodPromptOfType(type: ComponentType, foodId: string): Prompt | undefined {
    const state = this.store.$state;
    const foodIndex = getFoodIndexRequired(state.data.meals, foodId);
    const foodState = getFoodByIndex(state.data.meals, foodIndex);
    const mealState = state.data.meals[foodIndex.mealIndex];

    return this.scheme.prompts.meals.foods.find(
      prompt =>
        prompt.component === type
        && checkFoodCustomConditions(this.store, mealState, foodState, prompt),
    );
  }

  findMealPromptOfType(
    type: ComponentType,
    section: MealSection,
    mealId: string,
  ): Prompt | undefined {
    const state = this.store.$state;
    const meal = findMeal(state.data.meals, mealId);

    return this.scheme.prompts.meals[section].find(
      prompt => prompt.component === type && checkMealCustomConditions(this.store, meal, prompt),
    );
  }

  findSurveyPromptOfType(type: ComponentType, section: SurveyPromptSection): Prompt | undefined {
    return this.scheme.prompts[section].find(
      prompt => prompt.component === type && checkSurveyCustomConditions(this.store, prompt),
    );
  }

  nextSurveySectionPrompt(section: SurveyPromptSection): Prompt | undefined {
    return this.scheme.prompts[section].find(
      prompt =>
        checkSurveyStandardConditions(this.store.$state, prompt)
        && checkSurveyCustomConditions(this.store, prompt),
    );
  }

  nextMealSectionPrompt(
    section: MealSection,
    mealId: string,
    withSelection: Selection | null,
  ): Prompt | undefined {
    const state = this.store.$state;
    const meal = findMeal(state.data.meals, mealId);

    // Post foods prompts should only be triggered when all food data is collected
    // TODO: Probably should include food custom prompts as well
    if (section === 'postFoods' && !mealComplete(meal))
      return undefined;

    return this.scheme.prompts.meals[section].find(
      prompt =>
        checkMealStandardConditions(state, meal, withSelection, prompt)
        && checkMealCustomConditions(this.store, meal, prompt),
    );
  }

  nextFoodsPrompt(foodId: string, withSelection: Selection | null): Prompt | undefined {
    const state = this.store.$state;

    const foodIndex = getFoodIndexRequired(state.data.meals, foodId);
    const foodState = getFoodByIndex(state.data.meals, foodIndex);
    const mealState = state.data.meals[foodIndex.mealIndex];

    return this.scheme.prompts.meals.foods.find(
      prompt =>
        checkFoodStandardConditions(state, foodState, withSelection, prompt)
        && checkFoodCustomConditions(this.store, mealState, foodState, prompt),
    );
  }

  /**
   * Set next Prompt in the Survey based on the type of the prompt component
   * @param component type of the prompt component to find
   * @returns { Prompt }
   */
  setNextPreMealsPrompt(component: ComponentType): Prompt | undefined {
    return this.scheme.prompts.preMeals.find(prompt =>
      showPrompt(this.store.$state, prompt, component),
    );
  }
}
