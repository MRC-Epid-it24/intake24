import { SurveySubmissionEntry } from '@intake24/common/types/http';
import SurveyFood from './survey-food';
import SurveyMeal from './survey-meal';

export default class SurveySubmission {
  readonly id: string;

  readonly startTime: Date;

  readonly endTime: Date;

  readonly meals: SurveyMeal[];

  constructor(id: string, startTime: Date, endTime: Date, meals: SurveyMeal[]) {
    this.id = id;
    this.startTime = startTime;
    this.endTime = endTime;
    this.meals = meals.map((m) => m.clone());
  }

  clone(): SurveySubmission {
    return new SurveySubmission(this.id, this.startTime, this.endTime, this.meals);
  }

  getFoods(): SurveyFood[] {
    return this.meals.map((meal) => meal.foods).reduce((acc, foods) => acc.concat(foods), []);
  }

  static fromJson(submission: SurveySubmissionEntry): SurveySubmission {
    return new SurveySubmission(
      submission.id,
      new Date(submission.startTime),
      new Date(submission.endTime),
      submission.meals.map((meal) => SurveyMeal.fromJson(meal))
    );
  }
}
