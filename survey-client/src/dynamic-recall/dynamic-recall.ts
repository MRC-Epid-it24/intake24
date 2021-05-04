import { Store } from 'vuex';
import { SurveyState } from '@/types/vuex';
import PromptManager from '@/dynamic-recall/prompt-manager';
import { PromptQuestion } from '@common/prompts';
import {
  MealSection,
  MealTime,
  SurveySection,
  SurveyState as CurrentSurveyState,
} from '@common/types';
import { SchemeEntryResponse } from '@common/types/http';
import SelectionManager from '@/dynamic-recall/selection-manager';

export interface PromptInstance {
  prompt: PromptQuestion;
  section: SurveySection | MealSection;
}

function parseMealTime(time: string): MealTime {
  const parts = time.split(':');
  return {
    hours: parseInt(parts[0], 10),
    minutes: parseInt(parts[1], 10),
  };
}

export default class DynamicRecall {
  private store: Store<any>;

  private surveyScheme: SchemeEntryResponse;

  private promptManager: PromptManager;

  private selectionManager: SelectionManager;

  constructor(surveyScheme: SchemeEntryResponse, store: Store<any>) {
    this.surveyScheme = surveyScheme;
    this.store = store;
    this.promptManager = new PromptManager(surveyScheme);
    this.selectionManager = new SelectionManager(store, this.promptManager);
  }

  private getSurveyState(): SurveyState {
    if (this.store.state.survey == null) {
      throw new Error('Survey state is null should not be null here');
    }

    return this.store.state.survey;
  }

  async initialiseSurvey() {
    if (!this.store.state.survey.data) {
      console.debug('Current survey data is null, starting new survey');

      const initialState: CurrentSurveyState = {
        schemeId: this.surveyScheme.id,
        startTime: new Date(),
        endTime: null,
        flags: [],
        customPromptAnswers: {},
        selection: {
          element: null,
          mode: 'auto',
        },
        meals: this.surveyScheme.meals.map((meal) => {
          return {
            name: meal.name.en!, // FIXME: pick correct locale and handle nulls
            defaultTime: parseMealTime(meal.time),
            time: undefined,
            flags: [],
            customPromptAnswers: {},
            foods: [],
          };
        }),
      };

      await this.store.dispatch('survey/setState', initialState);
    }
  }

  getNextPromptForCurrentSelection(): PromptInstance | undefined {
    const surveyState = this.getSurveyState();
    const recallState = surveyState.data!;

    if (recallState.selection.element == null) {
      const nextPrompt = this.promptManager.nextPreMealsPrompt(surveyState);
      if (nextPrompt) return { prompt: nextPrompt, section: 'preMeals' };
    } else {
      switch (recallState.selection.element.type) {
        case 'meal': {
          const { mealIndex } = recallState.selection.element;
          const mealPrompt = this.promptManager.nextPreFoodsPrompt(surveyState, mealIndex);

          // TODO: handle post-foods prompts

          if (mealPrompt)
            return {
              prompt: mealPrompt,
              section: 'preFoods',
            };
          break;
        }
        case 'food': {
          const { mealIndex, foodIndex } = recallState.selection.element;
          const foodPrompt = this.promptManager.nextFoodsPrompt(surveyState, mealIndex, foodIndex);

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

  getNextPrompt(): PromptInstance | undefined {
    const nextPrompt = this.getNextPromptForCurrentSelection();

    if (nextPrompt) return nextPrompt;

    console.debug('No prompts left for current selection');

    const nextSelection = this.selectionManager.nextSelection();

    console.debug(`Next selection: ${JSON.stringify(nextSelection)}`);

    if (nextSelection) {
      this.store.commit('survey/setSelection', nextSelection);
      return this.getNextPromptForCurrentSelection();
    }

    return undefined;
  }

  setCurrentPrompt(promptComponent: PromptQuestion['component']): PromptInstance | undefined {
    const surveyState = this.getSurveyState();
    const recallState = surveyState.data!;
    const nextPrompt = this.promptManager.setNextPreMealsPrompt(surveyState, promptComponent);

    if (nextPrompt)
      return {
        prompt: nextPrompt,
        section: 'preMeals',
      };

    // FIXME: Delete console log
    console.log('setCurrentPrompt');
    console.log();

    return undefined;
  }
}
