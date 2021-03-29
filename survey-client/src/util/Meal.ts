import {
  Meal as MealDefinition,
  MealQuestionSection,
  MealQuestions,
  Prompt,
  PromptStatuses,
  PromptQuestion,
  MealState,
  PromptState,
} from '@common/types';

import Food from './Food';

export default class Meal {
  private name: string;

  private time: string;

  private flags: string[] = [];

  private preFoods: Prompt[] = [];

  private foods: Food[] = [];

  private foodQuestions: PromptQuestion[] = [];

  private postFoods: Prompt[] = [];

  constructor(meal: MealDefinition, questions: MealQuestions) {
    const { name, time } = meal;
    // !!! TODO: FIX THIS !!! load some default translation
    this.name = name.en ?? 'Default';
    this.time = time;

    (['preFoods', 'postFoods'] as MealQuestionSection[]).forEach((item) => {
      this.loadPrompts(item, questions[item]);
    });

    this.foodQuestions = questions.foods;
  }

  private loadPrompts(section: MealQuestionSection, questions: PromptQuestion[]): void {
    this[section] = questions.map((question) => ({
      question,
      answer: null,
      status: PromptStatuses.INITIAL,
    }));
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
