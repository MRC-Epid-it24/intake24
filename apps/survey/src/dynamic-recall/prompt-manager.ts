import type { ComponentType, Condition, PromptQuestion } from '@intake24/common/prompts';
import type {
  MealQuestionSection,
  MealSection,
  SurveyQuestionSection,
} from '@intake24/common/schemes';
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
} from '@intake24/survey/stores/meal-food-utils';

import type { SurveyState } from '../stores';
import { recallLog } from '../stores';
import {
  asServedComplete,
  cerealComplete,
  drinkScaleComplete,
  guideImageComplete,
  milkInAHotDrinkComplete,
  pizzaComplete,
  portionSizeMethodSelected,
  standardPortionComplete,
} from './portion-size-checks';

const checkRecallNumber = (state: SurveyState, condition: Condition) => {
  if (state.user === null) {
    console.error('User information should not be null at this point');
    return false;
  }
  return conditionOps[condition.op]([condition.value, state.user.submissions + 1]);
};

const showPrompt = (state: SurveyState, prompt: PromptQuestion, component: ComponentType) =>
  prompt.component === component;

const checkSurveyStandardConditions = (state: SurveyState, prompt: PromptQuestion): boolean => {
  switch (prompt.component) {
    case 'info-prompt':
      return !state.data.flags.includes(`${prompt.id}-acknowledged`);
    case 'submit-prompt':
      return !state.data.endTime;
    case 'meal-add-prompt':
      return false;
    case 'review-confirm-prompt':
      return false;
    default:
      return state.data.customPromptAnswers[prompt.id] === undefined;
  }
};

const checkSurveyCustomConditions = (state: SurveyState, prompt: PromptQuestion) =>
  prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'surveyPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          state.data.customPromptAnswers[condition.props.promptId],
        ]);
      case 'recallNumber':
        return checkRecallNumber(state, condition);
      default:
        console.error(`Unexpected condition type: ${condition.type}`);
        return false;
    }
  });

const checkMealStandardConditions = (
  surveyState: SurveyState,
  mealState: MealState,
  prompt: PromptQuestion
): boolean => {
  switch (prompt.component) {
    case 'meal-time-prompt':
      if (mealState.time === undefined) {
        recallLog().promptCheck('meal-time-prompt', true, 'time is undefined');
        return true;
      } else {
        recallLog().promptCheck('meal-time-prompt', false, 'time is defined');
        return false;
      }
    case 'edit-meal-prompt':
      return mealState.foods.length === 0;
    case 'info-prompt':
      return mealState.flags.includes(`${prompt.id}-acknowledged`);
    case 'no-more-information-prompt':
      if (surveyState.data.selection.mode === 'manual') {
        recallLog().promptCheck(
          'no-more-information-prompt',
          true,
          `Manual: no more prompts left for ${mealState.name.en}`
        );
        return true;
      } else {
        recallLog().promptCheck(
          'no-more-information-prompt',
          false,
          `Auto: no more prompts left for ${mealState.name.en}`
        );
        return false;
      }
    default:
      return mealState.customPromptAnswers[prompt.id] === undefined;
  }
};

const checkMealCustomConditions = (
  surveyState: SurveyState,
  mealState: MealState,
  prompt: PromptQuestion
) =>
  prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'surveyPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          surveyState.data.customPromptAnswers[condition.props.promptId],
        ]);
      case 'mealPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          mealState.customPromptAnswers[condition.props.promptId],
        ]);
      case 'recallNumber':
        return checkRecallNumber(surveyState, condition);
      default:
        console.error(`Unexpected condition type: ${condition.type}`);
        return false;
    }
  });

const checkFoodStandardConditions = (
  surveyState: SurveyState,
  foodState: FoodState,
  prompt: PromptQuestion
): boolean => {
  switch (prompt.component) {
    case 'info-prompt': {
      if (foodState.flags.includes(`${prompt.id}-acknowledged`)) {
        recallLog().promptCheck('info-prompt', false, `${prompt.id}-acknowledged flag set`);
        return false;
      }
      recallLog().promptCheck('info-prompt', true, `${prompt.id}-acknowledged flag not set`);
      return true;
    }

    case 'food-search-prompt': {
      const freeEntryComplete =
        surveyState.data.meals.length > 0 &&
        surveyState.data.meals.every((meal) => meal.flags.includes('free-entry-complete'));

      if (foodState.type === 'free-text' && freeEntryComplete) {
        recallLog().promptCheck(
          'food-search-prompt',
          true,
          'Selected food entry type is free-text and all meals have free-entry-complete flag set'
        );
        return true;
      }
      recallLog().promptCheck(
        'food-search-prompt',
        false,
        `Selected food entry type is ${foodState.type}, free entry complete: ${freeEntryComplete}`
      );
      return false;
    }

    case 'portion-size-option-prompt': {
      if (foodState.type === 'encoded-food' && foodState.portionSizeMethodIndex === null) {
        recallLog().promptCheck(
          'portion-size-option-prompt',
          true,
          'Entry type is encoded-food and no portion size method is selected'
        );
        return true;
      }
      recallLog().promptCheck(
        'portion-size-option-prompt',
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
          'as-served-prompt',
          true,
          'As served portion size method selected but yet not complete'
        );
        return true;
      }
      recallLog().promptCheck(
        'as-served-prompt',
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
          'cereal-prompt',
          true,
          'Cereal portion size method selected but yet not complete'
        );
        return true;
      }
      recallLog().promptCheck(
        'cereal-prompt',
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
          'guide-image-prompt',
          true,
          'Guide image selected but estimation not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        'guide-image-prompt',
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
          'drink-scale-prompt',
          true,
          'Drink Scale selected but estimation not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        'drink-scale-prompt',
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
          'milk-in-a-hot-drink-prompt',
          true,
          'Milk in hot drink selected but estimation not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        'milk-in-a-hot-drink-prompt',
        false,
        portionSizeMethodSelected(foodState, 'milk-in-a-hot-drink')
          ? 'Milk in hot drink estimation already complete'
          : 'Milk in hot drink estimation not selected'
      );
      return false;
    }

    case 'pizza-prompt': {
      if (portionSizeMethodSelected(foodState, 'pizza') && !pizzaComplete(foodState)) {
        recallLog().promptCheck(
          'pizza-prompt',
          true,
          'Pizza selected but estimation not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        'pizza-prompt',
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
          'standard-portion-prompt',
          true,
          'Standard portion estimation selected but not yet complete'
        );
        return true;
      }
      recallLog().promptCheck(
        'standard-portion-prompt',
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

    case 'no-more-information-prompt':
      if (surveyState.data.selection.mode === 'manual') {
        recallLog().promptCheck(
          'no-more-information-prompt',
          true,
          `Manual: no more prompts left for ${foodState.id}`
        );
        return true;
      } else {
        recallLog().promptCheck(
          'no-more-information-prompt',
          false,
          `Auto: no more prompts left for ${foodState.id}`
        );
        return false;
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
  surveyState: SurveyState,
  mealState: MealState,
  foodState: FoodState,
  prompt: PromptQuestion
) =>
  prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'surveyPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          surveyState.data.customPromptAnswers[condition.props.promptId],
        ]);
      case 'mealPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          mealState.customPromptAnswers[condition.props.promptId],
        ]);
      case 'foodPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          foodState.customPromptAnswers[condition.props.promptId],
        ]);
      case 'recallNumber':
        return checkRecallNumber(surveyState, condition);
      default:
        console.error(`Unexpected condition type: ${condition.type}`);
        return false;
    }
  });

export default class PromptManager {
  private scheme;

  constructor(scheme: SchemeEntryResponse) {
    this.scheme = scheme;
  }

  findMealPromptOfType(type: ComponentType, section: MealSection): PromptQuestion | undefined {
    return this.scheme.questions.meals[section].find((question) => question.component === type);
  }

  findSurveyPromptOfType(
    type: ComponentType,
    section: SurveyQuestionSection
  ): PromptQuestion | undefined {
    return this.scheme.questions[section].find((question) => question.component === type);
  }

  nextSurveySectionPrompt(
    state: SurveyState,
    section: SurveyQuestionSection
  ): PromptQuestion | undefined {
    return this.scheme.questions[section].find((question) => {
      return (
        checkSurveyStandardConditions(state, question) &&
        checkSurveyCustomConditions(state, question)
      );
    });
  }

  nextMealSectionPrompt(
    state: SurveyState,
    section: MealQuestionSection,
    mealId: number
  ): PromptQuestion | undefined {
    const mealState = findMeal(state.data.meals, mealId);

    // Post foods prompts should only be triggered when all food data is collected
    // TODO: Probably should include food custom questions as well
    if (section === 'postFoods') {
      const meal = findMeal(state.data.meals, mealId);
      if (!(mealPortionSizeComplete(meal) && mealAssociatedFoodsComplete(meal))) {
        if (state.data.selection.mode === 'manual')
          return this.scheme.questions.meals['postFoods'].find((question) => {
            return checkMealStandardConditions(state, mealState, question);
          });
        return undefined;
      }
    }

    return this.scheme.questions.meals[section].find((question) => {
      return (
        checkMealStandardConditions(state, mealState, question) &&
        checkMealCustomConditions(state, mealState, question)
      );
    });
  }

  nextFoodsPrompt(state: SurveyState, foodId: number): PromptQuestion | undefined {
    const foodIndex = getFoodIndexRequired(state.data.meals, foodId);
    const foodState = getFoodByIndex(state.data.meals, foodIndex);
    const mealState = state.data.meals[foodIndex.mealIndex];

    return this.scheme.questions.meals.foods.find((question) => {
      return (
        checkFoodStandardConditions(state, foodState, question) &&
        checkFoodCustomConditions(state, mealState, foodState, question)
      );
    });
  }

  /**
   * Set next Prompt in the Survey based on the type of the prompt component
   * @param state state of the Survey
   * @param component type of the prompt component to find
   * @returns { PromptQuestion }
   */
  setNextPreMealsPrompt(state: SurveyState, component: ComponentType): PromptQuestion | undefined {
    return this.scheme.questions.preMeals.find((question) =>
      showPrompt(state, question, component)
    );
  }
}
