import { NutrientRuleType, Sentiment, Sex } from '../../../feedback';
import type { OmitAndOptional } from '..';

export type DemographicGroupAttributes = {
  id: string;
  minAge: number | null;
  maxAge: number | null;
  minHeight: number | null;
  maxHeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  sex: Sex | null;
  physicalActivityLevelId: string | null;
  nutrientTypeId: string;
  nutrientRuleType: NutrientRuleType;
};

export type DemographicGroupCreationAttributes = OmitAndOptional<
  DemographicGroupAttributes,
  'id',
  | 'minAge'
  | 'maxAge'
  | 'minHeight'
  | 'maxHeight'
  | 'minWeight'
  | 'maxWeight'
  | 'sex'
  | 'physicalActivityLevelId'
>;

export type DemographicGroupScaleSectorAttributes = {
  id: string;
  demographicGroupId: string;
  name: string;
  description: string | null;
  sentiment: Sentiment;
  minRange: number;
  maxRange: number;
};

export type DemographicGroupScaleSectorCreationAttributes = OmitAndOptional<
  DemographicGroupScaleSectorAttributes,
  'id',
  'description'
>;
