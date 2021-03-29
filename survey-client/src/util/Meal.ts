import {
  Meal as MealDefinition,
  MealQuestionSection,
  MealQuestions,
  Prompt,
  PromptStatuses,
  PromptQuestion,
  MealState,
  PromptState,
  Selection,
  conditionOps,
} from '@common/types';

import { findAnswerFor } from './Recall';
import Food from './Food';

export default class Meal {
  private name: string;

  private time: string;

  private flags: string[] = [];

  private preFoods: Prompt[] = [];

  private foods: Food[] = [];

  // private foodQuestions: PromptQuestion[] = [];

  private postFoods: Prompt[] = [];

  constructor(meal: MealDefinition, questions: MealQuestions) {
    const { name, time } = meal;
    // !!! TODO: FIX THIS !!! load some default translation
    this.name = name.en ?? 'Default';
    this.time = time;

    (['preFoods', 'postFoods'] as MealQuestionSection[]).forEach((item) => {
      this.loadPrompts(item, questions[item]);
    });

    // this.foodQuestions = questions.foods;
  }

  private loadPrompts(section: MealQuestionSection, questions: PromptQuestion[]): void {
    this[section] = questions.map((question) => ({
      question,
      answer: question.component === 'meal-time-prompt' ? this.time : null,
      status: PromptStatuses.INITIAL,
    }));
  }

  getNextAutoSelection(): Selection | null {
    const preFoods = this.getAutoSectionQuestion('preFoods');
    if (preFoods) return preFoods;

    const postFoods = this.getAutoSectionQuestion('postFoods');
    if (postFoods) return postFoods;

    return null;
  }

  getAutoSectionQuestion(section: MealQuestionSection): Selection | null {
    const index = this[section].findIndex((item) => item.status !== PromptStatuses.DONE);
    if (index === -1) return null;

    return this.checkQuestionConditions(section, index);
  }

  getManualSectionQuestion(section: MealQuestionSection, questionId: string): Selection | null {
    const index = this[section].findIndex((item) => item.question.id === questionId);
    if (index === -1) return null;

    if (index > 0 && this[section][index - 1].status !== PromptStatuses.DONE) return null;

    return this.checkQuestionConditions(section, index);
  }

  /*
   * TODO:
   * - bits of duplication with main Recall class
   * - still lots of moving parts at the moment
   * - once logic is a bit finalized, consider to extract common/generic logic to base to extend from
   */
  private checkQuestionConditions(
    section: MealQuestionSection,
    promptIdx: number
  ): Selection | null {
    const prompt = this[section][promptIdx];

    const check = this.promptMeetsConditions(prompt);
    if (check) return { section: 'meals', mealSection: section, promptIdx, prompt };

    this[section][promptIdx].status = PromptStatuses.DONE;
    return this.getAutoSectionQuestion(section);
  }

  private getAllQuestions(): Prompt[] {
    return [...this.preFoods, ...this.postFoods];
  }

  private promptMeetsConditions(prompt: Prompt): boolean {
    const { conditions } = prompt.question.props;

    if (!conditions.length) return true;

    for (const condition of conditions) {
      // TODO: Extract switch to separate handler once more condition types are implemented
      switch (condition.type) {
        case 'promptAnswer':
          if (prompt.question.id === condition.props.promptId) {
            console.warn(`Referencing itself...?`);
            return true;
          }

          // eslint-disable-next-line no-case-declarations
          const matchPrompt = findAnswerFor(this.getAllQuestions(), condition.props.promptId);
          if (!matchPrompt) return true;

          if (Array.isArray(matchPrompt)) {
            console.warn(`Not yet supported prompt answer condition.`);
            return false;
          }

          return conditionOps[condition.op]([condition.value, matchPrompt]);
        default:
          break;
      }
    }

    return false;
  }

  getState(): MealState {
    const promptStateMapper = (item: Prompt) => ({
      questionId: item.question.id,
      answer: item.answer,
      status: item.status,
    });

    const { name, time } = this;
    const preFoods: PromptState[] = this.preFoods.map(promptStateMapper);
    const postFoods: PromptState[] = this.postFoods.map(promptStateMapper);

    return {
      name,
      time,
      flags: [...this.flags],
      preFoods,
      postFoods,
    };
  }
}
