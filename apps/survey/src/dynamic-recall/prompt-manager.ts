import type { ComponentType, Condition, PromptQuestion } from '@intake24/common/prompts';
import { conditionOps } from '@intake24/common/prompts';
import type { MealSection, SurveyQuestionSection } from '@intake24/common/schemes';
import type { SchemeEntryResponse } from '@intake24/common/types/http';
import {
  asServedLeftoversComplete,
  asServedServingComplete,
  guideImageComplete,
  portionSizeMethodSelected,
  standardPortionComplete,
  drinkScaleComplete,
} from './portion-size-checks';
import type { SurveyState } from '../stores';
import { recallLog } from '../stores';
import {
  findMeal,
  getFoodByIndex,
  getFoodIndexRequired,
} from '@intake24/survey/stores/meal-food-utils';
import type { FoodState, MealState } from '@intake24/common/types';

const checkRecallNumber = (state: SurveyState, condition: Condition) => {
  if (state.user === null) {
    console.error('User information should not be null at this point');
    return false;
  }
  return conditionOps[condition.op]([condition.value, state.user.recallNumber]);
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
  if (prompt.component === 'meal-time-prompt') return mealState.time === undefined;

  if (prompt.component === 'edit-meal-prompt') return mealState.foods.length === 0;

  switch (prompt.component) {
    case 'info-prompt':
      return mealState.flags.includes(`${prompt.id}-acknowledged`);
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
      if (foodState.type === 'free-text') {
        recallLog().promptCheck(
          'food-search-prompt',
          true,
          'Selected food entry type is free-text'
        );
        return true;
      }
      recallLog().promptCheck(
        'food-search-prompt',
        false,
        `Selected food entry type is ${foodState.type}`
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
      if (
        portionSizeMethodSelected(foodState, 'as-served') &&
        !asServedServingComplete(foodState)
      ) {
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

    case 'as-served-leftovers-prompt': {
      if (
        portionSizeMethodSelected(foodState, 'as-served') &&
        !asServedLeftoversComplete(foodState)
      ) {
        recallLog().promptCheck(
          'as-served-leftovers-prompt',
          true,
          'As served portion size method selected but leftovers not yet estimated'
        );
        return true;
      }
      recallLog().promptCheck(
        'as-served-leftovers-prompt',
        false,
        portionSizeMethodSelected(foodState, 'as-served')
          ? 'As served leftovers estimation already complete'
          : 'As served portion size estimation not selected'
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

      return (
        foodState.data.associatedFoodPrompts.length !== 0 && !foodState.associatedFoodsComplete
      );
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

  nextPreMealsPrompt(state: SurveyState): PromptQuestion | undefined {
    return this.scheme.questions.preMeals.find(
      (question) =>
        checkSurveyStandardConditions(state, question) &&
        checkSurveyCustomConditions(state, question)
    );
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

  nextPreFoodsPrompt(state: SurveyState, mealId: number): PromptQuestion | undefined {
    const mealState = findMeal(state.data.meals, mealId);

    return this.scheme.questions.meals.preFoods.find((question) => {
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

  nextSubmissionPrompt(state: SurveyState): PromptQuestion | undefined {
    return this.scheme.questions.submission.find((question) => {
      return (
        checkSurveyStandardConditions(state, question) &&
        checkSurveyCustomConditions(state, question)
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
