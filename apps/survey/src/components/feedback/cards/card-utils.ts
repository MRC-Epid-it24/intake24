/* eslint-disable global-require */
import { NutrientRuleType, Sentiment } from '@intake24/common/feedback';
import { LocaleTranslation, RequiredLocaleTranslation } from '@intake24/common/types';
import { CharacterTypeEnum, DemographicRange } from '@intake24/survey/feedback';

export type FeedbackDetails = {
  readonly name: RequiredLocaleTranslation;
  readonly description: LocaleTranslation;
  readonly intake: number;
  readonly targetIntake: DemographicRange;
  readonly unit: string;
  readonly unitDescription: string;
  readonly sentiment: Sentiment;
  readonly textClass: string;
  readonly iconClass: string;
  readonly warning?: LocaleTranslation;
};

export const characterImageMap: Record<CharacterTypeEnum, any> = {
  battery: require(`@intake24/survey/assets/feedback/characters/energy.jpg`),
  bread: require(`@intake24/survey/assets/feedback/characters/carbs.jpg`),
  egg: require(`@intake24/survey/assets/feedback/characters/protein.jpg`),
  apple: require(`@intake24/survey/assets/feedback/characters/fibre.jpg`),
  salmon: require(`@intake24/survey/assets/feedback/characters/vitamin_a.jpg`),
  // sausage: require(`@intake24/survey/assets/feedback/characters/vitamin_a.jpg`),
  milk: require(`@intake24/survey/assets/feedback/characters/calcium.jpg`),
  candy: require(`@intake24/survey/assets/feedback/characters/sugar.jpg`),
  strawberry: require(`@intake24/survey/assets/feedback/characters/vitamin_c.jpg`),
  burger: require(`@intake24/survey/assets/feedback/characters/sat_fat.jpg`),
  fries: require(`@intake24/survey/assets/feedback/characters/fat.jpg`),
  co2: require(`@intake24/survey/assets/feedback/characters/co2.jpg`),
  iron: require(`@intake24/survey/assets/feedback/characters/iron.jpg`),
  folate: require(`@intake24/survey/assets/feedback/characters/folate.jpg`),
};

export const fiveADayImageMap: Record<string, any> = {
  fruit_veg: require(`@intake24/survey/assets/feedback/five-a-day/fruit_veg.jpg`),
};

export const nutrientGroupImageMap: Record<string, any> = {
  '266': require(`@intake24/survey/assets/feedback/food-groups/beef.jpg`),
};

export const getTextClass = (sentiment: Sentiment): string => {
  if ([Sentiment.TOO_LOW, Sentiment.LOW, Sentiment.HIGH, Sentiment.TOO_HIGH].includes(sentiment))
    return 'danger--text';

  if ([Sentiment.BIT_LOW, Sentiment.BIT_HIGH].includes(sentiment)) return 'warning--text';

  return 'success--text';
};

export const getIconClass = (sentiment: Sentiment): string => {
  const icons: Record<Sentiment, string> = {
    [Sentiment.TOO_LOW]: 'fas fa-angle-double-down',
    [Sentiment.LOW]: 'fas fa-angle-double-down',
    [Sentiment.BIT_LOW]: 'fas fa-angle-down',
    [Sentiment.GOOD]: 'fas fa-crosshairs',
    [Sentiment.EXCELLENT]: 'fas fa-crosshairs',
    [Sentiment.BIT_HIGH]: 'fas fa-angle-up',
    [Sentiment.HIGH]: 'fas fa-angle-double-up',
    [Sentiment.TOO_HIGH]: 'fas fa-angle-double-up',
  };

  return icons[sentiment];
};

export const getUnitFromNutrientRule = (
  nutrientRule: NutrientRuleType,
  defaultUnit: string
): string => {
  switch (nutrientRule) {
    case NutrientRuleType.ENERGY_DIVIDED_BY_BMR:
      return '%';
    case NutrientRuleType.PER_UNIT_OF_WEIGHT:
      return `${defaultUnit} per kg`;
    case NutrientRuleType.PERCENTAGE_OF_ENERGY:
      return '%';
    case NutrientRuleType.RANGE:
      return defaultUnit;
    default:
      return defaultUnit;
  }
};
