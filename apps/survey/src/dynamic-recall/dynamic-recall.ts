import type { PromptQuestion } from '@intake24/common/prompts';
import type { MealSection, SurveyQuestionSection, SurveySection } from '@intake24/common/schemes';
import type { MealTime, SurveyState as CurrentSurveyState } from '@intake24/common/types';
import type { SchemeEntryResponse } from '@intake24/common/types/http';
import PromptManager from '@intake24/survey/dynamic-recall/prompt-manager';
import SelectionManager from '@intake24/survey/dynamic-recall/selection-manager';
import { findMeal } from '@intake24/survey/stores/meal-food-utils';

import type { SurveyState, SurveyStore } from '../stores';

export interface PromptInstance {
  prompt: PromptQuestion;
  section: SurveySection | MealSection;
}

export const parseMealTime = (time: string): MealTime => {
  const [hours, minutes] = time.split(':');

  return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
};

export const surveyInitialState: CurrentSurveyState = {
  schemeId: null,
  startTime: null,
  endTime: null,
  flags: [],
  customPromptAnswers: {},
  continueButtonEnabled: false,
  tempPromptAnswer: {
    response: null,
    modified: false,
    new: true,
    finished: false,
    mealIndex: undefined,
    foodIndex: undefined,
    prompt: undefined,
  },
  selection: {
    element: null,
    mode: 'auto',
  },
  meals: [],
  nextFoodId: 0,
  nextMealId: 0,
};

export default class DynamicRecall {
  private store;

  private surveyScheme;

  readonly promptManager;

  private selectionManager;

  constructor(surveyScheme: SchemeEntryResponse, store: SurveyStore) {
    this.surveyScheme = surveyScheme;
    this.store = store;
    this.promptManager = new PromptManager(surveyScheme);
    this.selectionManager = new SelectionManager(store, this.promptManager);
  }

  async initialiseSurvey() {
    if (!this.store.hasStarted) {
      console.debug('Current survey data is null, starting new survey');

      const initialState: CurrentSurveyState = {
        ...surveyInitialState,
        schemeId: this.surveyScheme.id,
        startTime: new Date(),
        meals: this.surveyScheme.meals.map((meal) => ({
          id: this.store.getNextMealId(),
          name: meal.name,
          defaultTime: parseMealTime(meal.time),
          time: undefined,
          flags: [],
          customPromptAnswers: {},
          foods: [],
        })),
      };

      await this.store.setState(initialState);
    }
  }

  foodPromptsComplete(surveyState: SurveyState, mealId: number): boolean {
    const foods = findMeal(surveyState.data.meals, mealId).foods;

    return foods.every(
      (food) => this.promptManager.nextFoodsPrompt(surveyState, food.id) === undefined
    );
  }

  getNextPromptForCurrentSelection(): PromptInstance | undefined {
    const surveyState = this.store.$state;
    const recallState = surveyState.data;

    if (recallState.selection.element !== null) {
      switch (recallState.selection.element.type) {
        case 'meal': {
          const { mealId } = recallState.selection.element;
          const mealPrompt = this.promptManager.nextMealSectionPrompt(
            surveyState,
            'preFoods',
            mealId
          );

          if (mealPrompt)
            return {
              prompt: mealPrompt,
              section: 'preFoods',
            };

          if (this.foodPromptsComplete(surveyState, mealId)) {
            const mealPrompt = this.promptManager.nextMealSectionPrompt(
              surveyState,
              'postFoods',
              mealId
            );

            if (mealPrompt)
              return {
                prompt: mealPrompt,
                section: 'postFoods',
              };
          }
          break;
        }
        case 'food': {
          const { foodId } = recallState.selection.element;
          const foodPrompt = this.promptManager.nextFoodsPrompt(surveyState, foodId);

          if (foodPrompt)
            return {
              prompt: foodPrompt,
              section: 'foods',
            };

          break;
        }
        default:
          break;
      }
    }

    return undefined;
  }

  getNextSurveySectionPrompt(section: SurveyQuestionSection): PromptInstance | undefined {
    const nextPrompt = this.promptManager.nextSurveySectionPrompt(this.store.$state, section);
    if (nextPrompt) return { prompt: nextPrompt, section };

    return undefined;
  }

  /*
   The basic idea behind the prompt selection logic is that it has no internal state.

   The next prompt is only a function of the current state of the recall data, which means
   that any prompt at any point could make a change to the state of the recall such that any
   other prompt could become enabled again, or, alternatively, that we can start from any
   initial (partially complete) state and the prompt selection logic should still collect all
   the missing information.

   We must therefore check every prompt rule in the correct sequence every time a prompt is
   complete.

   The sequence is as follows:

     Pre meals
     Foods/meals
     Post meals
     Submission

   Food and meal prompts operate using the selection system. A food/meal must be selected in
   order for the applicable prompts to trigger.

   Once a food or meal prompt is complete, all other prompts applicable to the currently
   selected item are checked.

   If there are no more prompts available, the system will automatically select the next
   appropriate item (food or meal) based on the rules defined in the selection manager.

   Once no more pre meals, food/meal, or post meals prompts are available, the recall is
   considered complete and ready for submission.
   */
  getNextPrompt(): PromptInstance | undefined {
    // First make sure pre meals prompts are complete

    // There are two ways to handle the situation when a food/meal is selected but a pre-meal
    // prompt is available:
    //
    // 1) Prioritise the pre-meal prompt, but the current selection will have to be cleared
    //    so that the custom prompts write their results to the survey section in the store rather
    //    than the selected food/meal
    //
    // 2) First complete all the remaining prompts for the currently selected item, then show
    //    the pre-meals prompt.
    //
    // Currently, option 1 is implemented to avoid excessive switching between pre-meals/meals
    // layout in the desktop version.

    let nextPrompt = this.getNextSurveySectionPrompt('preMeals');
    if (nextPrompt) {
      this.store.setSelection({ mode: 'auto', element: null });
      return nextPrompt;
    }

    console.debug('Pre-meals prompts complete');

    // Then check if a prompt is available for the current selection
    nextPrompt = this.getNextPromptForCurrentSelection();
    if (nextPrompt) return nextPrompt;

    // If not, try selecting a food or meal that still has some prompts available
    const nextSelection = this.selectionManager.nextSelection();
    this.store.setSelection(nextSelection);

    if (nextSelection.element !== null) {
      // Food/meal will only be selected if it has prompts available,
      // so this is guaranteed to not be undefined
      return this.getNextPromptForCurrentSelection();
    }

    console.debug('Food/meal prompts complete');

    // Make sure post meals prompts are complete
    nextPrompt = this.getNextSurveySectionPrompt('preMeals');
    if (nextPrompt) return nextPrompt;

    console.debug('Post-meals prompts complete');

    // And finally the submission prompts
    return this.getNextSurveySectionPrompt('submission');
  }
}
