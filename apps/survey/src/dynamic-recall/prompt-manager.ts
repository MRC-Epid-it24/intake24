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
} from './portion-size-checks';
import type { SurveyState } from '../stores';
import { recallLog } from '../stores';

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
  state: SurveyState,
  mealIndex: number,
  prompt: PromptQuestion
): boolean => {
  if (prompt.component === 'meal-time-prompt')
    return state.data.meals[mealIndex].time === undefined;

  if (prompt.component === 'edit-meal-prompt')
    return state.data.meals[mealIndex].foods.length === 0;

  switch (prompt.component) {
    case 'info-prompt':
      return !state.data.meals[mealIndex].flags.includes(`${prompt.id}-acknowledged`);
    default:
      return state.data.meals[mealIndex].customPromptAnswers[prompt.id] === undefined;
  }
};

const checkMealCustomConditions = (state: SurveyState, mealIndex: number, prompt: PromptQuestion) =>
  prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'surveyPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          state.data.customPromptAnswers[condition.props.promptId],
        ]);
      case 'mealPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          state.data.meals[mealIndex].customPromptAnswers[condition.props.promptId],
        ]);
      case 'recallNumber':
        return checkRecallNumber(state, condition);
      default:
        console.error(`Unexpected condition type: ${condition.type}`);
        return false;
    }
  });

const checkFoodStandardConditions = (
  state: SurveyState,
  mealIndex: number,
  foodIndex: number,
  prompt: PromptQuestion
): boolean => {
  const selectedFood = state.data.meals[mealIndex].foods[foodIndex];

  if (selectedFood === undefined)
    throw new Error('This function must only be called when a food is selected');

  switch (prompt.component) {
    case 'info-prompt': {
      if (selectedFood.flags.includes(`${prompt.id}-acknowledged`)) {
        recallLog().promptCheck('info-prompt', false, `${prompt.id}-acknowledged flag set`);
        return false;
      }
      recallLog().promptCheck('info-prompt', true, `${prompt.id}-acknowledged flag not set`);
      return true;
    }

    case 'food-search-prompt': {
      if (selectedFood.type === 'free-text') {
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
        `Selected food entry type is ${selectedFood.type}`
      );
      return false;
    }

    case 'portion-size-option-prompt': {
      if (selectedFood.type === 'encoded-food' && selectedFood.portionSizeMethodIndex === null) {
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
        selectedFood.type === 'encoded-food'
          ? 'Portion size method already selected'
          : 'Entry type is not encoded-food'
      );
      return false;
    }

    case 'as-served-prompt': {
      if (
        portionSizeMethodSelected(selectedFood, 'as-served') &&
        !asServedServingComplete(selectedFood)
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
        portionSizeMethodSelected(selectedFood, 'as-served')
          ? 'As served portion size estimation not selected'
          : 'As served portion size estimation already complete'
      );
      return false;
    }

    case 'as-served-leftovers-prompt': {
      if (
        portionSizeMethodSelected(selectedFood, 'as-served') &&
        !asServedLeftoversComplete(selectedFood)
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
        portionSizeMethodSelected(selectedFood, 'as-served')
          ? 'As served leftovers estimation already complete'
          : 'As served portion size estimation not selected'
      );
      return false;
    }

    case 'guide-image-prompt': {
      if (
        portionSizeMethodSelected(selectedFood, 'guide-image') &&
        !guideImageComplete(selectedFood)
      ) {
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
        portionSizeMethodSelected(selectedFood, 'guide-image')
          ? 'Guide image estimation already complete'
          : 'Guide image estimation not selected'
      );
      return false;
    }

    case 'standard-portion-prompt': {
      if (
        portionSizeMethodSelected(selectedFood, 'standard-portion') &&
        !standardPortionComplete(selectedFood)
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
        portionSizeMethodSelected(selectedFood, 'standard-portion')
          ? 'Standard portion estimation already complete'
          : 'Standard portion estimation not selected'
      );
      return false;
    }

    case 'associated-foods-prompt': {
      if (selectedFood.type !== 'encoded-food') return false;

      return (
        selectedFood.data.associatedFoodPrompts.length !== 0 &&
        !selectedFood.associatedFoodsComplete
      );
    }

    default: {
      if (selectedFood.customPromptAnswers[prompt.id] === undefined) {
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
  state: SurveyState,
  mealIndex: number,
  foodIndex: number,
  prompt: PromptQuestion
) =>
  prompt.props.conditions.every((condition) => {
    switch (condition.type) {
      case 'surveyPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          state.data.customPromptAnswers[condition.props.promptId],
        ]);
      case 'mealPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          state.data.meals[mealIndex].customPromptAnswers[condition.props.promptId],
        ]);
      case 'foodPromptAnswer':
        return conditionOps[condition.op]([
          condition.value,
          state.data.meals[mealIndex].foods[foodIndex].customPromptAnswers[
            condition.props.promptId
          ],
        ]);
      case 'recallNumber':
        return checkRecallNumber(state, condition);
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

  nextPreFoodsPrompt(state: SurveyState, mealIndex: number): PromptQuestion | undefined {
    return this.scheme.questions.meals.preFoods.find((question) => {
      return (
        checkMealStandardConditions(state, mealIndex, question) &&
        checkMealCustomConditions(state, mealIndex, question)
      );
    });
  }

  nextFoodsPrompt(
    state: SurveyState,
    mealIndex: number,
    foodIndex: number
  ): PromptQuestion | undefined {
    return this.scheme.questions.meals.foods.find((question) => {
      return (
        checkFoodStandardConditions(state, mealIndex, foodIndex, question) &&
        checkFoodCustomConditions(state, mealIndex, foodIndex, question)
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
