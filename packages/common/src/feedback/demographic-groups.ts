import type { LocaleTranslation, RequiredLocaleTranslation } from '../types';
import type { NutrientRuleType, Range, Sentiment, Sex } from './shared';

export type DemographicGroupScaleSector = {
  name: RequiredLocaleTranslation;
  description: LocaleTranslation;
  range: Range;
  sentiment: Sentiment;
};

export type DemographicGroup = {
  id: string;
  type: 'demographic-group';
  age: Range | null;
  height: Range | null;
  weight: Range | null;
  nutrientRuleType: NutrientRuleType;
  nutrientTypeId: string;
  physicalActivityLevelId: string | null;
  scaleSectors: DemographicGroupScaleSector[];
  sex: Sex | null;
};

// Type for validator
export type DemographicGroups = DemographicGroup[];
