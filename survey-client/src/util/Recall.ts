import {
  Meal as MealDefinition,
  MealQuestions,
  Prompt,
  PromptStatuses,
  PromptQuestion,
  QuestionSection,
  RecallSection,
  Selection,
  PromptAnswer,
  PromptState,
  RecallState,
  conditionOps,
} from '@common/types';
import { SchemeEntryResponse } from '@common/types/http';
import Meal from './Meal';

// TODO: move this to more appropriate place
export const findAnswerFor = (prompts: Prompt[], questionsId: string): PromptAnswer | undefined => {
  const prompt = prompts.find((item) => item.question.id === questionsId);

  return prompt?.answer;
};

export class Recall {
  private schemeId: string | null = null;

  private startTime: Date | null = null;

  private endTime: Date | null = null;

  private flags: string[] = [];

  private preMeals: Prompt[] = [];

  private meals: Meal[] = [];

  private postMeals: Prompt[] = [];

  private submission: Prompt[] = [];

  currentSelection: Selection | null = null;

  init(scheme: SchemeEntryResponse): void {
    const { id, meals, questions } = scheme;
    this.schemeId = id;

    (['preMeals', 'postMeals', 'submission'] as QuestionSection[]).forEach((item) => {
      this.loadPrompts(item, questions[item]);
    });

    this.loadMeals(meals, questions.meals);
  }

  start(): Selection | null {
    this.startTime = new Date();

    this.setNextAutoSelection();

    return this.getSelection();
  }

  isInitialized(): boolean {
    return !!this.schemeId;
  }

  hasStarted(): boolean {
    return this.isInitialized() && !!this.startTime;
  }

  private loadMeals(meals: MealDefinition[], questions: MealQuestions): void {
    this.meals = meals.map((meal) => new Meal(meal, questions));
  }

  private loadPrompts(section: QuestionSection, questions: PromptQuestion[]): void {
    this[section] = questions.map((question) => ({
      question,
      answer: null,
      status: PromptStatuses.INITIAL,
    }));
  }

  private isSectionDone(section: QuestionSection): boolean {
    if (!this[section].length) return true;

    return this[section].every((question) => question.status === PromptStatuses.DONE);
  }

  getSelection(): Selection | null {
    return this.currentSelection;
  }

  setSelection(selection: Selection | null): void {
    this.currentSelection = selection;
  }

  selectQuestionOrFindNext(
    section: RecallSection,
    mealId: string,
    questionId: string
  ): Selection | null {
    if (section === 'meals') {
      if (!this.isSectionDone('preMeals')) {
        this.getNextAutoSelection();
        return null;
      }

      return null;
      /* const manualSelection = this.meals[parseInt(mealId, 10)].getManualSectionQuestion(
        section,
        questionId
      );
      if (manualSelection) {
        this.setSelection(manualSelection);
        return null;
      }

      const autoSelection = this.getNextAutoSelection();
      return autoSelection; */
    }

    const manualSelection = this.getManualSectionQuestion(section, questionId);
    if (manualSelection) {
      this.setSelection(manualSelection);
      return null;
    }

    const autoSelection = this.getNextAutoSelection();
    return autoSelection;
  }

  getNextAutoSelection(): Selection | null {
    // preMeals
    const preMeals = this.getAutoSectionQuestion('preMeals');
    if (preMeals) return preMeals;

    // Meals
    for (const [index, meal] of this.meals.entries()) {
      const mealSelection = meal.getNextAutoSelection();
      if (mealSelection) return { ...mealSelection, mealIdx: index };
    }

    // TODO: Pre foods questions

    // TODO: Foods questions

    // If food is not .done, ask the relevant portion questions
    // Portion estimation method (if there are multiple methods available)
    // Otherwise display prompt for relevant method

    // TODO: Post-foods questions

    // postMeals
    const postMeals = this.getAutoSectionQuestion('postMeals');
    if (postMeals) return postMeals;

    // submission
    const submission = this.getAutoSectionQuestion('submission');
    if (submission) return submission;

    return null;
  }

  setNextAutoSelection(): void {
    this.setSelection(this.getNextAutoSelection());
  }

  getAutoSectionQuestion(section: QuestionSection): Selection | null {
    const index = this[section].findIndex((item) => item.status !== PromptStatuses.DONE);
    if (index === -1) return null;

    return this.checkQuestionConditions(section, index);
  }

  getManualSectionQuestion(section: QuestionSection, questionId: string): Selection | null {
    const index = this[section].findIndex((item) => item.question.id === questionId);
    if (index === -1) return null;

    if (index > 0 && this[section][index - 1].status !== PromptStatuses.DONE) return null;

    return this.checkQuestionConditions(section, index);
  }

  private checkQuestionConditions(section: QuestionSection, promptIdx: number): Selection | null {
    const prompt = this[section][promptIdx];

    const check = this.promptMeetsConditions(prompt);
    if (check) return { section, promptIdx, prompt };

    this[section][promptIdx].status = PromptStatuses.DONE;
    return this.getAutoSectionQuestion(section);
  }

  private getAllQuestions(): Prompt[] {
    return [...this.preMeals, ...this.postMeals, ...this.submission];
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

  answerQuestion(answer: string | string[]): Selection | null {
    const { currentSelection } = this;
    if (!currentSelection) return this.getNextAutoSelection();

    const {
      section,
      mealSection,
      mealIdx,
      promptIdx,
      prompt: { question },
    } = currentSelection;

    if (mealSection && mealIdx !== undefined) {
      const meals = this[section] as Meal[];
      meals[mealIdx][mealSection].splice(promptIdx, 1, {
        question,
        answer,
        status: PromptStatuses.DONE,
      });
    } else this[section].splice(promptIdx, 1, { question, answer, status: PromptStatuses.DONE });

    return this.getNextAutoSelection();
  }

  getState(): RecallState {
    const promptStateMapper = (item: Prompt) => ({
      questionId: item.question.id,
      answer: item.answer,
      status: item.status,
    });

    const { schemeId, startTime, endTime } = this;

    const preMeals: PromptState[] = this.preMeals.map(promptStateMapper);
    const postMeals: PromptState[] = this.postMeals.map(promptStateMapper);
    const submission: PromptState[] = this.submission.map(promptStateMapper);

    const meals = this.meals.map((meal) => meal.getState());

    return {
      schemeId,
      startTime,
      endTime,
      flags: [...this.flags],
      preMeals,
      meals,
      postMeals,
      submission,
    };
  }

  submit(): RecallState {
    this.endTime = new Date();
    return this.getState();
  }
}

/*
 * Singleton for now
 * - could be maintained through vuex, but all logic would have to be built into the vuex pattern
 * - use Vue.js composition API to create "separate" simple store to inject
 */
export default new Recall();
