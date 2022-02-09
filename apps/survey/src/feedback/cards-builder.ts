import { CardType, FiveADay, NutrientGroup } from '@intake24/common/feedback';
import { round } from '@intake24/common/util';
import {
  AggregateFoodStats,
  CharacterParameters,
  CharacterRules,
  DemographicRange,
  FruitAndVegPortions,
  UserDemographic,
} from './classes';

export type CardWithCharRules = CharacterRules | FiveADay | NutrientGroup;

export interface FiveADayParameters extends FiveADay {
  readonly portions: number;
}

export interface NutrientGroupParameters extends NutrientGroup {
  readonly intake: number;
  readonly targetIntake: DemographicRange;
}

export type FeedbackCardParameters =
  | CharacterParameters
  | FiveADayParameters
  | NutrientGroupParameters;

export type BuildCardOps = {
  foods: AggregateFoodStats[];
  userDemographic: UserDemographic;
  averageIntake: Map<string, number>;
  fruitAndVegPortions: FruitAndVegPortions;
};

export const buildCharacterParams = (
  characterRule: CharacterRules,
  { foods, userDemographic }: BuildCardOps
): FeedbackCardParameters | null => {
  const sentiment = characterRule.getSentiment(userDemographic, foods);
  if (!sentiment) {
    const { characterType, nutrientTypeIds, demographicGroups } = characterRule;
    console.warn(
      'Sentiment for character',
      characterType,
      'nutrientTypeIds',
      nutrientTypeIds,
      'resulted empty. Demographic groups',
      demographicGroups
    );
    return null;
  }

  return sentiment;
};

export const buildNutrientGroupParams = (
  foodGroup: NutrientGroup,
  { averageIntake }: BuildCardOps
): NutrientGroupParameters => {
  const { low, high } = foodGroup;

  let intake = foodGroup.nutrientTypes.reduce((total, nutrientTypeId) => {
    const nutrientIntake = averageIntake.get(nutrientTypeId);
    if (nutrientIntake !== undefined) return total + nutrientIntake;

    return total;
  }, 0);
  intake = round(intake);

  const targetIntake = new DemographicRange(low?.threshold ?? 0, high?.threshold ?? 1000);

  return { ...foodGroup, intake, targetIntake };
};

export const buildFiveADayParams = (
  foodGroup: FiveADay,
  { fruitAndVegPortions }: BuildCardOps
): FiveADayParameters => ({ ...foodGroup, portions: round(fruitAndVegPortions.total) });

export const mappers: Record<
  CardType,
  (card: any, ops: BuildCardOps) => FeedbackCardParameters | null
> = {
  character: buildCharacterParams,
  'five-a-day': buildFiveADayParams,
  'nutrient-group': buildNutrientGroupParams,
};

export const buildCardParams = (
  cards: CardWithCharRules[],
  ops: BuildCardOps
): FeedbackCardParameters[] => {
  const cardParameters = cards.reduce<FeedbackCardParameters[]>((acc, card) => {
    const cardParams = mappers[card.type](card, ops);
    if (cardParams) acc.push(cardParams);

    return acc;
  }, []);

  return cardParameters;
};
