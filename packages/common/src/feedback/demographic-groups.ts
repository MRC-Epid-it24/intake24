import type { LocaleTranslation, RequiredLocaleTranslation } from '../types';
import type { NutrientRuleType, Range, Sentiment, Sex } from './shared';

export type DemographicGroupScaleSector = {
  name: RequiredLocaleTranslation;
  summary: LocaleTranslation;
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

export const demographicGroupScaleSectorDefaults: DemographicGroupScaleSector = {
  name: { en: 'Energy' },
  summary: { en: '' },
  description: { en: '' },
  range: { start: 0, end: 10 },
  sentiment: 'good',
};

export const demographicGroupDefaults: DemographicGroup = {
  id: 'demographic-group',
  type: 'demographic-group',
  age: null,
  height: null,
  weight: null,
  nutrientRuleType: 'energy_divided_by_bmr',
  nutrientTypeId: '1',
  physicalActivityLevelId: '1',
  sex: null,
  scaleSectors: [{ ...demographicGroupScaleSectorDefaults }],
};
