import {
  FiveADayFeedback,
  FoodGroup,
  NutrientGroupFeedback,
  FeedbackType,
} from '@intake24/common/feedback';
import { round } from '@intake24/common/util';
import {
  AggregateFoodStats,
  CharacterParameters,
  CharacterRules,
  DemographicRange,
  FruitAndVegPortions,
  UserDemographic,
} from './classes';

export interface FiveADayParameters extends FiveADayFeedback {
  readonly card: 'five-a-day';
  readonly portions: number;
}

export interface NutrientGroupParameters extends NutrientGroupFeedback {
  readonly card: 'nutrient-group';
  readonly intake: number;
  readonly targetIntake: DemographicRange;
}

export type FeedbackParameters = CharacterParameters | FiveADayParameters | NutrientGroupParameters;

export const buildCharacterParams = (
  foods: AggregateFoodStats[],
  characterRules: CharacterRules[],
  userDemographic: UserDemographic,
  feedbackType: FeedbackType
): FeedbackParameters[] =>
  characterRules
    .filter((cr) => !cr.displayInFeedbackStyle || cr.displayInFeedbackStyle === feedbackType)
    .map((characterRule) => {
      const sentiment = characterRule.getSentiment(userDemographic, foods);
      if (!sentiment) {
        console.warn(
          'Sentiment for character',
          characterRule.type,
          'nutrientTypeIds',
          characterRule.nutrientTypeIds,
          'resulted empty. Demographic groups',
          characterRule.demographicGroups
        );
        return null;
      }

      return sentiment;
    })
    .filter((sentiment) => sentiment) as FeedbackParameters[];

export const buildNutrientGroupParams = (
  foodGroup: NutrientGroupFeedback,
  averageIntake: Map<string, number>
): NutrientGroupParameters => {
  const { low, high } = foodGroup;

  let intake = foodGroup.nutrientTypes.reduce((total, nutrientTypeId) => {
    const nutrientIntake = averageIntake.get(nutrientTypeId);
    if (nutrientIntake !== undefined) return total + nutrientIntake;

    return total;
  }, 0);
  intake = round(intake);

  const targetIntake = new DemographicRange(low?.threshold ?? 0, high?.threshold ?? 1000);

  return { ...foodGroup, card: 'nutrient-group', intake, targetIntake };
};

export const buildFiveADayParams = (
  foodGroup: FiveADayFeedback,
  fruitAndVegAverages: FruitAndVegPortions
): FiveADayParameters => ({
  ...foodGroup,
  card: 'five-a-day',
  portions: round(fruitAndVegAverages.total),
});

export const buildFoodGroupParams = (
  foodGroups: FoodGroup[],
  averageIntake: Map<string, number>,
  fruitAndVegAverages: FruitAndVegPortions
): FeedbackParameters[] =>
  foodGroups.map((foodGroup) =>
    foodGroup.type === 'nutrient-group'
      ? buildNutrientGroupParams(foodGroup, averageIntake)
      : buildFiveADayParams(foodGroup, fruitAndVegAverages)
  );
