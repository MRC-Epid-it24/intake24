import type { CardType, NutrientRuleType, Sentiment } from '@intake24/common/feedback';
import type {
  CharacterParameters,
  FiveADayParameters,
  NutrientGroupParameters,
} from '@intake24/ui/feedback';
import { round } from '@intake24/common/util';
import { useI18n } from '@intake24/i18n';
import { DemographicRange } from '@intake24/ui/feedback';

export type FeedbackDetails = {
  name: string;
  summary: string | null;
  description: string | null;
  intake: number;
  recommendedIntake: DemographicRange | null;
  unit: string;
  unitDescription: string | null;
  sentiment: Sentiment | null;
  color: string;
  textClass?: string;
  iconClass: string;
  warning?: string | null;
};

export function getTextClass(sentiment: Sentiment | null): string | undefined {
  if (!sentiment)
    return undefined;

  if (['too_low', 'low', 'high', 'too_high'].includes(sentiment))
    return 'danger--text';

  if (['bit_low', 'bit_high'].includes(sentiment))
    return 'warning--text';

  return 'success--text';
}

export function getIconClass(sentiment: Sentiment | null): string {
  const defaultIcon = 'fas fa-crosshairs';

  const icons: Record<Sentiment, string> = {
    too_low: 'fas fa-angle-double-down',
    low: 'fas fa-angle-double-down',
    bit_low: 'fas fa-angle-down',
    good: defaultIcon,
    excellent: defaultIcon,
    bit_high: 'fas fa-angle-up',
    high: 'fas fa-angle-double-up',
    too_high: 'fas fa-angle-double-up',
  };

  return sentiment ? icons[sentiment] : defaultIcon;
}

export function getUnitFromNutrientRule(nutrientRule: NutrientRuleType, defaultUnit: string): string {
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
}

function getCharacterDetail(parameters: CharacterParameters): FeedbackDetails {
  const { translate, i18n } = useI18n();

  const { sentiment: charSentiment, results, color, showRecommendations } = parameters;

  const details = results.map((result) => {
    const {
      consumption: intake,
      resultedDemographicGroup: { nutrientRuleType, nutrient, scaleSectors },
    } = result;

    const { name, summary, description, range, sentiment } = scaleSectors[0];

    return {
      name: translate(name),
      summary: translate(summary),
      description: translate(description),
      intake: round(intake),
      recommendedIntake: showRecommendations
        ? new DemographicRange(round(range.start), round(range.end))
        : null,
      unit: getUnitFromNutrientRule(nutrientRuleType, nutrient!.unit),
      unitDescription: i18n.t(`feedback.unitDescription.${nutrientRuleType}`).toString(),
      sentiment,
      color,
      textClass: getTextClass(charSentiment ? sentiment : null),
      iconClass: getIconClass(charSentiment ? sentiment : null),
    };
  });

  return details[0];
}

function getFiveADayDetail(parameters: FiveADayParameters): FeedbackDetails {
  const { translate } = useI18n();

  const {
    low,
    high,
    unit,
    portions,
    color,
    scaleSector: { name, summary, description },
    showRecommendations,
  } = parameters;
  const sentiment = null;

  return {
    name: translate(name),
    summary: translate(summary),
    description: translate(description),
    intake: portions,
    recommendedIntake: showRecommendations
      ? new DemographicRange(high?.threshold ?? 5, high?.threshold ?? 5)
      : null,
    unit: translate(unit.name),
    unitDescription: translate(unit.description),
    sentiment,
    color,
    iconClass: getIconClass(sentiment),
    warning: low && portions < low.threshold ? translate(low.message) : undefined,
  };
}

function getNutrientGroupDetail(parameters: NutrientGroupParameters): FeedbackDetails {
  const { translate } = useI18n();

  const {
    low,
    high,
    unit,
    intake,
    recommendedIntake,
    color,
    scaleSector: { name, summary, description },
    showRecommendations,
  } = parameters;
  const sentiment = null;

  let warning;

  if (low && intake < low.threshold)
    warning = translate(low.message);
  else if (high && intake > high.threshold)
    warning = translate(high.message);

  return {
    name: translate(name),
    summary: translate(summary),
    description: translate(description),
    intake: round(intake),
    recommendedIntake: showRecommendations
      ? new DemographicRange(round(recommendedIntake.start), round(recommendedIntake.end))
      : null,
    unit: translate(unit.name),
    unitDescription: translate(unit.description),
    sentiment,
    color,
    iconClass: getIconClass(sentiment),
    warning,
  };
}

export const getDetails: Record<CardType, (...args: any[]) => FeedbackDetails> = {
  character: getCharacterDetail,
  'five-a-day': getFiveADayDetail,
  'nutrient-group': getNutrientGroupDetail,
};
