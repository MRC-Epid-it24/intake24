import { Store } from 'vuex';
import { SurveyState } from '@/types/vuex';
import PromptManager from '@/dynamic-recall/prompt-manager';
import { PromptAnswer, PromptQuestion } from '@common/prompts';
import { Dictionary, QuestionSection, SurveyState as CurrentSurveyState } from '@common/types';
import { SchemeEntryResponse } from '@common/types/http';
import Vue from 'vue';

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

  constructor(surveyScheme: SchemeEntryResponse, store: Store<any>) {
    this.surveyScheme = surveyScheme;
    this.store = store;
    this.promptManager = new PromptManager(surveyScheme);
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

  getNextPrompt(): PromptInstance | undefined {
    const surveyState = this.getSurveyState();

    // Check if any pre-meals prompts are available
    const nextPrompt = this.promptManager.nextPreMealsPrompt(surveyState);
    const { store } = this;

    if (nextPrompt)
      return {
        async onPromptComponentMounted(promptComponent: Vue, onComplete: () => Promise<void>) {
          switch (nextPrompt.component) {
            case 'info-prompt':
              promptComponent.$on('answer', async () => {
                store.commit('survey/setSurveyFlag', `${nextPrompt.id}-acknowledged`);
                await onComplete();
              });
              break;
            default:
              promptComponent.$on('answer', async (answer: PromptAnswer) => {
                store.commit('survey/setCustomPromptAnswer', {
                  promptId: nextPrompt.id,
                  answer,
                });
                await onComplete();
              });
              break;
          }
        },

        prompt: nextPrompt,
        promptProps: nextPrompt.props,
        section: 'preMeals',
      };

    return nextPrompt;

    // For current selection
  }
}
