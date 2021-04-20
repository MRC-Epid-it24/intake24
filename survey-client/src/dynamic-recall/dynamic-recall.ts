import { Store } from 'vuex';
import { SurveyState } from '@/types/vuex';
import PromptManager from '@/dynamic-recall/prompt-manager';
import { PromptAnswer, PromptQuestion } from '@common/prompts';
import { Dictionary, QuestionSection, SurveyState as CurrentSurveyState } from '@common/types';
import { SchemeEntryResponse } from '@common/types/http';
import Vue from 'vue';
import SelectionManager from '@/dynamic-recall/selection-manager';

export interface PromptInstance {
  prompt: PromptQuestion;
  promptProps: Dictionary;
  section: QuestionSection;

  onPromptComponentMounted(promptComponent: Vue, onComplete: () => Promise<void>): Promise<void>;
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
          element: {
            type: 'meal',
            mealIndex: 0,
          },
          mode: 'auto',
        },
        meals: this.surveyScheme.meals.map((meal) => {
          return {
            name: meal.name.en!, // FIXME: pick correct locale and handle nulls
            defaultTime: { hours: 8, minutes: 0 }, // FIXME: fix types and use meal.time from scheme
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
                promptId: prompt.id,
                answer, // FIXME: time types
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
      promptProps: prompt.props,
      section: 'preMeals',
    };
  }

  getNextPromptForCurrentSelection(): PromptInstance | undefined {
    const surveyState = this.getSurveyState();
    const recallState = surveyState.data!;

    // Check if any pre-meals prompts are available
    const nextPrompt = this.promptManager.nextPreMealsPrompt(surveyState);

    if (nextPrompt) return this.createSurveyPromptInstance(nextPrompt);

    if (recallState.selection.element != null) {
      switch (recallState.selection.element.type) {
        case 'meal': {
          const { mealIndex } = recallState.selection.element;
          const mealPrompt = this.promptManager.nextPreFoodsPrompt(surveyState, mealIndex);

          // TODO: add post-foods prompts

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

    const nextSelection = this.selectionManager.nextSelection();

    if (nextSelection) {
      this.store.commit('survey/setSelection', nextSelection);
      return this.getNextPromptForCurrentSelection();
    }

    return undefined;
  }
}
