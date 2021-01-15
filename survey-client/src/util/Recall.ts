/* eslint-disable no-restricted-syntax */
import {
  MealDefinition,
  MealQuestions,
  Prompt,
  PromptStatuses,
  PromptQuestion,
  QuestionSection,
  Scheme,
  Selection,
} from '@common/types';
import Meal from './Meal';

export default class Recall {
  id: string;

  name: string;

  flags: string[] = [];

  preMeals: Prompt[] = [];

  meals: Meal[] = [];

  mealQuestions: MealQuestions;

  postMeals: Prompt[] = [];

  submission: Prompt[] = [];

  constructor(scheme: Scheme) {
    const { id, name, meals, questions } = scheme;
    this.id = id;
    this.name = name;

    (['preMeals', 'postMeals', 'submission'] as QuestionSection[]).forEach((item) => {
      this.loadPrompts(item, questions[item]);
    });

    this.mealQuestions = questions.meals;
    this.loadMeals(meals, questions.meals);
  }

  loadMeals(meals: MealDefinition[], questions: MealQuestions): void {
    this.meals = meals.map((meal) => new Meal(meal, questions));
  }

  loadPrompts(section: QuestionSection, questions: PromptQuestion[]): void {
    this[section] = questions.map((question) => ({
      question,
      answer: null,
      status: PromptStatuses.INITIAL,
    }));
  }

  currentSelection(): Selection | null {
    // Iterate pre and post meal custom questions
    for (const section of ['preMeals', 'postMeals'] as QuestionSection[]) {
      const selection = this.getNextSectionQuestion(section);
      if (selection) return selection;
    }

    // TO DO: Pre-submission questions - this only gets first submission question
    const prompt = this.submission[0];
    return { section: 'submission', index: 0, prompt };

    // TODO: Pre foods questions

    // TODO: Foods questions

    // If food is not .done, ask the relevant portion questions
    // Portion estimation method (if there are multiple methods available)
    // Otherwise display prompt for relevant method

    // TODO: Post-foods questions
  }

  getNextQuestion(): Selection | null {
    // preMeals
    const preMeals = this.getNextSectionQuestion('preMeals');
    if (preMeals) return preMeals;

    // meals
    /* const meals = this.getNextSectionQuestion('preMeals');
    if (meals) return meals; */

    // postMeals
    const postMeals = this.getNextSectionQuestion('preMeals');
    if (postMeals) return postMeals;

    // submission
    const submission = this.getNextSectionQuestion('submission');
    if (submission) return submission;

    // TODO: Pre foods questions

    // TODO: Foods questions

    // TODO: Post-foods questions

    return null;
  }

  getNextSectionQuestion(section: QuestionSection): Selection | null {
    if (this.isSectionDone(section)) return null;

    const index = this[section].findIndex((item) => item.status !== PromptStatuses.DONE);
    if (index === -1) return null;

    return { section, index, prompt: this[section][index] };
  }

  isPreMealDone(): boolean {
    return this.isSectionDone('preMeals');
  }

  isPostMealDone(): boolean {
    return this.isSectionDone('postMeals');
  }

  isSubmitted(): boolean {
    return this.isSectionDone('submission');
  }

  isSectionDone(section: QuestionSection): boolean {
    if (this[section].length === 0) return true;

    return this[section].every((question) => question.status === PromptStatuses.DONE);
  }

  answerQuestion(answer: string | string[]): void {
    const currectSelection = this.currentSelection();
    if (!currectSelection) return;

    const {
      section,
      index,
      prompt: { question },
    } = currectSelection;

    this[section].splice(index, 1, { question, answer, status: PromptStatuses.DONE });
  }
}
