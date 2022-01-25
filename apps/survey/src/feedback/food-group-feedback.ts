import { FoodGroupFeedback as FoodGroupFeedbackResponse } from '@intake24/common/types/http';
import DemographicRange from './demographic-range';

export type FoodGroupFeedbackThreshold = {
  threshold: number;
  message: string;
};

const NUTRIENT_ID_RED_MEAT = '266';

export default class FoodGroupFeedback {
  readonly name: string;

  readonly nutrients: string[];

  readonly recommendedIntake: DemographicRange;

  readonly low?: FoodGroupFeedbackThreshold;

  readonly high?: FoodGroupFeedbackThreshold;

  readonly tellMeMoreText: string;

  constructor(
    name: string,
    nutrients: string[],
    recommendedIntake: DemographicRange,
    tellMeMoreText: string,
    low?: FoodGroupFeedbackThreshold,
    high?: FoodGroupFeedbackThreshold
  ) {
    this.name = name;
    this.nutrients = nutrients;
    this.recommendedIntake = recommendedIntake;
    this.tellMeMoreText = tellMeMoreText;
    this.low = low;
    this.high = high;
  }

  static fromJson(groups: FoodGroupFeedbackResponse[]): FoodGroupFeedback[] {
    const result: FoodGroupFeedback[] = [];

    for (const group of groups) {
      const {
        name,
        nutrients,
        tellMeMoreText,
        tooLowMessage,
        tooLowThreshold,
        tooHighMessage,
        tooHighThreshold,
      } = group;

      const low =
        tooLowThreshold !== null && tooLowMessage
          ? { threshold: tooLowThreshold, message: tooLowMessage }
          : undefined;
      const high =
        tooHighThreshold !== null && tooHighMessage
          ? { threshold: tooHighThreshold, message: tooHighMessage }
          : undefined;

      const recommendedIntake = new DemographicRange(
        low ? low.threshold : 0,
        high ? high.threshold : 1000
      );

      result.push(
        new FoodGroupFeedback(name, nutrients, recommendedIntake, tellMeMoreText, low, high)
      );
    }

    return result;
  }

  static getBackgroundClassForFoodGroup(foodGroupIds: string[]): string {
    if (foodGroupIds.includes(NUTRIENT_ID_RED_MEAT)) return 'red-meat';

    return '';
  }
}
