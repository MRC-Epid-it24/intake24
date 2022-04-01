import { CardType, NutrientRuleType, Sentiment } from '@intake24/common/feedback';
import {
  CharacterParameters,
  DemographicRange,
  FiveADayParameters,
  NutrientGroupParameters,
} from '@intake24/ui/feedback';
import { RequiredLocaleTranslation, LocaleTranslation } from '@intake24/common/types';
import { round } from '@intake24/common/util';
import { useApp } from '@intake24/ui/stores';
import { shared } from '@intake24/i18n';

export type FeedbackDetails = {
  readonly name: string;
  readonly description: string | null;
  readonly intake: number;
  readonly recommendedIntake: DemographicRange | null;
  readonly unit: string;
  readonly unitDescription: string | null;
  readonly sentiment: Sentiment;
  readonly textClass: string;
  readonly iconClass: string;
  readonly warning?: string | null;
};

export const getLocaleContent = <T>(
  content: RequiredLocaleTranslation | LocaleTranslation<T>,
  locale: string
): string | T => content[locale] ?? content.en;

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

const getCharacterDetail = (parameters: CharacterParameters): FeedbackDetails => {
  const { results, showRecommendations } = parameters;

  const details = results.map((result) => {
    const {
      consumption: intake,
      resultedDemographicGroup: { nutrientRuleType, nutrient, scaleSectors },
    } = result;

    const { name, description, sentiment, range } = scaleSectors[0];
    const { lang } = useApp();

    // TODO: resolve this better from local application i18n
    const feedbackMsgs = shared[lang] ?? shared.en;
    const unitDescription = (feedbackMsgs.feedback.unitDescription as Record<string, string>)[
      nutrientRuleType
    ];

    return {
      name: getLocaleContent<string>(name, lang),
      description: getLocaleContent(description, lang),
      intake: round(intake),
      recommendedIntake: showRecommendations
        ? new DemographicRange(round(range.start), round(range.end))
        : null,
      unit: getUnitFromNutrientRule(nutrientRuleType, nutrient.unit),
      unitDescription,
      sentiment,
      textClass: getTextClass(sentiment),
      iconClass: getIconClass(sentiment),
    };
  });

  return details[0];
};

const getFiveADayDetail = (parameters: FiveADayParameters): FeedbackDetails => {
  const { name, description, low, high, unit, portions, showRecommendations } = parameters;
  const sentiment = 'good';

  const { lang } = useApp();

  return {
    name: getLocaleContent<string>(name, lang),
    description: getLocaleContent(description, lang),
    intake: portions,
    recommendedIntake: showRecommendations
      ? new DemographicRange(high?.threshold ?? 5, high?.threshold ?? 5)
      : null,
    unit: getLocaleContent<string>(unit.name, lang),
    unitDescription: getLocaleContent(unit.description, lang),
    sentiment,
    textClass: getTextClass(sentiment),
    iconClass: getIconClass(sentiment),
    warning: low && portions < low.threshold ? getLocaleContent(low.message, lang) : undefined,
  };
};

const getNutrientGroupDetail = (parameters: NutrientGroupParameters): FeedbackDetails => {
  const { name, description, low, high, unit, intake, recommendedIntake, showRecommendations } =
    parameters;
  const sentiment = 'good';

  const { lang } = useApp();

  let warning;

  if (low && intake < low.threshold) warning = getLocaleContent(low.message, lang);
  else if (high && intake > high.threshold) warning = getLocaleContent(high.message, lang);

  return {
    name: getLocaleContent<string>(name, lang),
    description: getLocaleContent(description, lang),
    intake: round(intake),
    recommendedIntake: showRecommendations
      ? new DemographicRange(round(recommendedIntake.start), round(recommendedIntake.end))
      : null,
    unit: getLocaleContent<string>(unit.name, lang),
    unitDescription: getLocaleContent(unit.description, lang),
    sentiment,
    textClass: getTextClass(sentiment),
    iconClass: getIconClass(sentiment),
    warning,
  };
};

export const getDetails: Record<CardType, (...args: any[]) => FeedbackDetails> = {
  character: getCharacterDetail,
  'five-a-day': getFiveADayDetail,
  'nutrient-group': getNutrientGroupDetail,
};
