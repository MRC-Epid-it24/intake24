import type { OmitAndOptional, Sex } from '..';

export enum NutrientRuleType {
  PERCENTAGE_OF_ENERGY = 'percentage_of_energy',
  ENERGY_DIVIDED_BY_BMR = 'energy_divided_by_bmr',
  PER_UNIT_OF_WEIGHT = 'per_unit_of_weight',
  RANGE = 'range',
}

export enum Sentiment {
  TOO_LOW = 'too_low',
  BIT_LOW = 'bit_low',
  GOOD = 'good',
  EXCELENT = 'excellent',
  HIGH = 'high',
  BIT_HIGH = 'bit_high',
  TOO_HIGH = 'too_high',
}

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
  sentiment: string;
  minRange: number;
  maxRange: number;
};

export type DemographicGroupScaleSectorCreationAttributes = OmitAndOptional<
  DemographicGroupScaleSectorAttributes,
  'id',
  'description'
>;
