/* eslint-disable global-require */
import i18n from '@intake24/survey/i18n';
import { CharacterType, NutrientRuleType, Sentiment } from '@intake24/common/feedback';
import { DemographicRange } from '@intake24/survey/feedback';
import { RequiredLocaleTranslation, LocaleTranslation } from '@intake24/common/types';

export type FeedbackDetails = {
  readonly name: string;
  readonly description: string | null;
  readonly intake: number;
  readonly targetIntake: DemographicRange;
  readonly unit: string;
  readonly unitDescription: string | null;
  readonly sentiment: Sentiment;
  readonly textClass: string;
  readonly iconClass: string;
  readonly warning?: string | null;
};

export const characterImageMap: Record<CharacterType, any> = {
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

export const getLocaleContent = <T>(
  content: RequiredLocaleTranslation | LocaleTranslation<T>
): string | T => {
  return content[i18n.locale] ?? content.en;
};

export const getTextClass = (sentiment: Sentiment): string => {
  if (['too_low', 'low', 'high', 'too_high'].includes(sentiment)) return 'danger--text';

  if (['bit_low', 'bit_high'].includes(sentiment)) return 'warning--text';

  return 'success--text';
};

export const getIconClass = (sentiment: Sentiment): string => {
  const icons: Record<Sentiment, string> = {
    too_low: 'fas fa-angle-double-down',
    low: 'fas fa-angle-double-down',
    bit_low: 'fas fa-angle-down',
    good: 'fas fa-crosshairs',
    excellent: 'fas fa-crosshairs',
    bit_high: 'fas fa-angle-up',
    high: 'fas fa-angle-double-up',
    too_high: 'fas fa-angle-double-up',
  };

  return icons[sentiment];
};

export const getUnitFromNutrientRule = (
  nutrientRule: NutrientRuleType,
  defaultUnit: string
): string => {
  switch (nutrientRule) {
    case 'energy_divided_by_bmr':
      return '%';
    case 'per_unit_of_weight':
      return `${defaultUnit} per kg`;
    case 'percentage_of_energy':
      return '%';
    case 'range':
    default:
      return defaultUnit;
  }
};
