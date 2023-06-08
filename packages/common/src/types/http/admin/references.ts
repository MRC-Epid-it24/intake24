import type {
  FeedbackSchemeAttributes,
  LanguageAttributes,
  NutrientTableAttributes,
  Pagination,
  StandardUnitAttributes,
  SurveyAttributes,
  SurveySchemeAttributes,
  SystemLocaleAttributes,
} from '@intake24/db';

export type FeedbackSchemeReferences = Pagination<FeedbackSchemeAttributes>;

export type LanguageReferences = Pagination<
  Pick<LanguageAttributes, 'id' | 'code' | 'englishName' | 'localName'>
>;

export type SystemLocaleReferences = Pagination<
  Pick<SystemLocaleAttributes, 'id' | 'code' | 'englishName' | 'localName'>
>;

export type StandardUnitReferences = Pagination<
  Pick<StandardUnitAttributes, 'id' | 'estimateIn' | 'howMany'>
>;

export type NutrientTableReferences = Pagination<
  Pick<NutrientTableAttributes, 'id' | 'description'>
>;

export type SurveySchemeReferences = Pagination<SurveySchemeAttributes>;

export type SurveyReferences = Pagination<Pick<SurveyAttributes, 'id' | 'name' | 'slug'>>;
