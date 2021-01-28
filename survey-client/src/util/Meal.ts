import {
  Meal as MealDefinition,
  MealQuestionSection,
  MealQuestions,
  Prompt,
  PromptStatuses,
  PromptQuestion,
} from '@common/types';

import Food from './Food';

export default class Meal {
  name: string;

  time: string;

  flags: string[] = [];

  preFoods: Prompt[] = [];

  foods: Food[] = [];

  foodQuestions: PromptQuestion[] = [];

  postFoods: Prompt[] = [];

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

  loadPrompts(section: MealQuestionSection, questions: PromptQuestion[]): void {
    this[section] = questions.map((question) => ({
      question,
      answer: null,
      status: PromptStatuses.INITIAL,
    }));
  }
}
