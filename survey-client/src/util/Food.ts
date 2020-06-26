import { Prompt, PromptQuestion, PromptStatuses } from '@/types/recall';

export default class Food {
  questions: Prompt[] = [];

  constructor(questions: PromptQuestion[]) {
    this.loadPrompts(questions);
  }

  loadPrompts(questions: PromptQuestion[]): void {
    this.questions = questions.map((question) => ({
      question,
      answer: null,
      status: PromptStatuses.INITIAL,
    }));
  }
}
