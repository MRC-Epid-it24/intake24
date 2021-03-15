import {
  Meal as MealDefinition,
  MealQuestions,
  Prompt,
  PromptStatuses,
  PromptQuestion,
  QuestionSection,
  Selection,
  PromptAnswer,
  conditionOps,
} from '@common/types';
import { Scheme } from '@common/types/models';
import Meal from './Meal';

const findAnswerFor = (prompts: Prompt[], questionsId: string): PromptAnswer | undefined => {
  const prompt = prompts.find((item) => item.question.id === questionsId);

  return prompt?.answer;
};

export default class Recall {
  id: string;

  name: string;

  flags: string[] = [];

  preMeals: Prompt[] = [];

  meals: Meal[] = [];

  // mealQuestions: MealQuestions;

  postMeals: Prompt[] = [];

  submission: Prompt[] = [];

  currentSelection!: Selection | null;

  constructor(scheme: Scheme) {
    const { id, name, meals, questions } = scheme;
    this.id = id;
    this.name = name;

    (['preMeals', 'postMeals', 'submission'] as QuestionSection[]).forEach((item) => {
      this.loadPrompts(item, questions[item]);
    });

    // this.mealQuestions = questions.meals;
    this.loadMeals(meals, questions.meals);

    this.getNextQuestion();
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

  getNextQuestion(): void {
    // preMeals
    const preMeals = this.getNextSectionQuestion('preMeals');
    if (preMeals) {
      this.setSelection(preMeals);
      return;
    }

    // Meals
    /* const meals = this.getNextSectionQuestion('preMeals');
    if (meals) return meals; */

    // TODO: Pre foods questions

    // TODO: Foods questions

    // If food is not .done, ask the relevant portion questions
    // Portion estimation method (if there are multiple methods available)
    // Otherwise display prompt for relevant method

    // TODO: Post-foods questions

    // postMeals
    const postMeals = this.getNextSectionQuestion('preMeals');
    if (postMeals) {
      this.setSelection(postMeals);
      return;
    }

    // submission
    const submission = this.getNextSectionQuestion('submission');
    if (submission) {
      this.setSelection(submission);
      return;
    }

    this.setSelection(null);
  }

  getSelection(): Selection | null {
    return this.currentSelection;
  }

  setSelection(selection: Selection | null): void {
    this.currentSelection = selection;
  }

  getNextSectionQuestion(section: QuestionSection): Selection | null {
    const index = this[section].findIndex((item) => item.status !== PromptStatuses.DONE);
    if (index === -1) return null;

    const prompt = this[section][index];

    const check = this.promptMeetsConditions(prompt);
    if (check) return { section, index, prompt };

    this[section][index].status = PromptStatuses.DONE;
    return this.getNextSectionQuestion(section);
  }

  getAllQuestions(): Prompt[] {
    // TODO: include meals section
    return [...this.preMeals, ...this.postMeals, ...this.submission];
  }

  promptMeetsConditions(prompt: Prompt): boolean {
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

  isSectionDone(section: QuestionSection): boolean {
    if (!this[section].length) return true;

    return this[section].every((question) => question.status === PromptStatuses.DONE);
  }

  answerQuestion(answer: string | string[]): void {
    const { currentSelection } = this;
    if (!currentSelection) return;

    const {
      section,
      index,
      prompt: { question },
    } = currentSelection;

    this[section].splice(index, 1, { question, answer, status: PromptStatuses.DONE });
    // This won't trigger computed prop observer
    // this[section][index] = { question, answer, status: PromptStatuses.DONE };

    this.getNextQuestion();
  }
}
