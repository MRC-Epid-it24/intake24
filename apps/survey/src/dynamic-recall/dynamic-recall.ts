import { Store } from 'vuex';
import { PromptQuestion } from '@intake24/common/prompts';
import { MealSection, SurveySection } from '@intake24/common/schemes';
import { MealTime, SurveyState as CurrentSurveyState } from '@intake24/common/types';
import { SchemeEntryResponse } from '@intake24/common/types/http';
import PromptManager from '@intake24/survey/dynamic-recall/prompt-manager';
import { RootStateWithModules, SurveyState } from '@intake24/survey/types/vuex';
import SelectionManager from '@intake24/survey/dynamic-recall/selection-manager';

export interface PromptInstance {
  prompt: PromptQuestion;
  section: SurveySection | MealSection;
}

export const parseMealTime = (time: string): MealTime => {
  const [hours, minutes] = time.split(':');
  return {
    hours: parseInt(hours, 10),
    minutes: parseInt(minutes, 10),
  };
};

export const surveyInitialState: CurrentSurveyState = {
  schemeId: null,
  startTime: null,
  endTime: null,
  flags: [],
  customPromptAnswers: {},
  selection: {
    element: null,
    mode: 'auto',
  },
  meals: [],
};

export default class DynamicRecall {
  private store;

  private surveyScheme;

  readonly promptManager;

  private selectionManager;

  constructor(surveyScheme: SchemeEntryResponse, store: Store<RootStateWithModules>) {
    this.surveyScheme = surveyScheme;
    this.store = store;
    this.promptManager = new PromptManager(surveyScheme);
    this.selectionManager = new SelectionManager(store, this.promptManager);
  }

  private getSurveyState(): SurveyState {
    return this.store.state.survey;
  }

  async initialiseSurvey() {
    if (!this.store.getters['survey/hasStarted']) {
      console.debug('Current survey data is null, starting new survey');

      const initialState: CurrentSurveyState = {
        ...surveyInitialState,
        schemeId: this.surveyScheme.id,
        startTime: new Date(),
        meals: this.surveyScheme.meals.map((meal) => ({
          name: meal.name.en!,
          localName: meal.name, // FIXME: pick correct locale and handle nulls
          defaultTime: parseMealTime(meal.time),
          time: undefined,
          flags: [],
          customPromptAnswers: {},
          foods: [],
        })),
      };

      await this.store.dispatch('survey/setState', initialState);
    }
  }

  getNextPromptForCurrentSelection(): PromptInstance | undefined {
    const surveyState = this.getSurveyState();
    const recallState = surveyState.data;

    if (recallState.selection.element === null) {
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
}
