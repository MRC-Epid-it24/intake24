import { Store } from 'vuex';
import { SurveyState } from '@/types/vuex';
import PromptManager from '@/dynamic-recall/prompt-manager';
import { PromptAnswer, PromptQuestion } from '@common/prompts';
import {
  Dictionary,
  MealSection,
  MealTime,
  QuestionSection,
  RecallSection,
  SurveyState as CurrentSurveyState,
} from '@common/types';
import { SchemeEntryResponse } from '@common/types/http';
import Vue from 'vue';
import SelectionManager from '@/dynamic-recall/selection-manager';

export interface PromptInstance {
  prompt: PromptQuestion;
  promptProps: Dictionary;
  section: RecallSection | MealSection;

  onPromptComponentMounted(promptComponent: Vue, onComplete: () => Promise<void>): Promise<void>;
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

  createSurveyPromptInstance(prompt: PromptQuestion): PromptInstance {
    const { store } = this;

    return {
      async onPromptComponentMounted(promptComponent: Vue, onComplete: () => Promise<void>) {
        switch (prompt.component) {
          case 'info-prompt':
            promptComponent.$on('answer', async () => {
              store.commit('survey/setSurveyFlag', `${prompt.id}-acknowledged`);
              await onComplete();
            });
            break;
          case 'meal-add-prompt':
            break;
          default:
            promptComponent.$on('answer', async (answer: PromptAnswer) => {
              store.commit('survey/setCustomPromptAnswer', {
                promptId: prompt.id,
                answer,
              });
              await onComplete();
            });
            break;
        }
      },

      prompt,
      promptProps: prompt.props,
      section: 'preMeals',
    };
  }

  createMealPromptInstance(prompt: PromptQuestion, mealIndex: number): PromptInstance {
    const { store } = this;
    const meal = store.state.survey.data.meals[mealIndex];

    const props: Dictionary = { ...prompt.props };

    switch (prompt.component) {
      case 'meal-time-prompt':
        props.mealName = meal.name;
        break;
      default:
        break;
    }

    return {
      async onPromptComponentMounted(promptComponent: Vue, onComplete: () => Promise<void>) {
        switch (prompt.component) {
          case 'info-prompt':
            promptComponent.$on('answer', async () => {
              store.commit('survey/setMealFlag', {
                mealIndex,
                flag: `${prompt.id}-acknowledged`,
              });
              await onComplete();
            });
            break;

          case 'meal-time-prompt':
            promptComponent.$on('answer', async (answer: string) => {
              store.commit('survey/setMealTime', {
                mealIndex,
                time: parseMealTime(answer),
              });
              await onComplete();
            });

            promptComponent.$on('removeMeal', async () => {
              store.commit('survey/deleteMeal', {
                mealIndex,
              });
              await onComplete();
            });

            break;
          default:
            promptComponent.$on('answer', async (answer: PromptAnswer) => {
              store.commit('survey/setMealCustomPromptAnswer', {
                mealIndex,
                promptId: prompt.id,
                answer,
              });
              await onComplete();
            });
            break;
        }
      },

      prompt,
      promptProps: props,
      section: 'preFoods',
    };
  }

  getNextPromptForCurrentSelection(): PromptInstance | undefined {
    const surveyState = this.getSurveyState();
    const recallState = surveyState.data!;

    if (recallState.selection.element == null) {
      const nextPrompt = this.promptManager.nextPreMealsPrompt(surveyState);
      if (nextPrompt) return this.createSurveyPromptInstance(nextPrompt);
    } else {
      switch (recallState.selection.element.type) {
        case 'meal': {
          const { mealIndex } = recallState.selection.element;
          const mealPrompt = this.promptManager.nextPreFoodsPrompt(surveyState, mealIndex);

          // TODO: handle post-foods prompts

          if (mealPrompt) return this.createMealPromptInstance(mealPrompt, mealIndex);
          break;
        }
        case 'food': {
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
    if (nextPrompt) return this.createSurveyPromptInstance(nextPrompt);
    return undefined;
  }
}
