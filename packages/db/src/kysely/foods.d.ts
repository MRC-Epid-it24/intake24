import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AsServedImages {
  asServedSetId: string;
  id: Generated<Int8>;
  imageId: Int8;
  thumbnailImageId: Int8;
  weight: number;
}

export interface AsServedSets {
  description: string;
  id: string;
  selectionImageId: Int8;
}

export interface AssociatedFoods {
  associatedCategoryCode: string | null;
  associatedFoodCode: string | null;
  foodCode: string;
  genericName: string;
  id: Generated<Int8>;
  linkAsMain: boolean;
  localeId: string;
  multiple: boolean;
  orderBy: Int8;
  text: string;
}

export interface AttributeDefaults {
  id: Generated<Int8>;
  readyMealOption: boolean | null;
  reasonableAmount: number | null;
  sameAsBeforeOption: boolean | null;
  useInRecipes: number | null;
}

export interface Brands {
  foodCode: string;
  id: Generated<Int8>;
  localeId: string;
  name: string;
}

export interface Categories {
  code: string;
  isHidden: boolean;
  name: string;
  version: string;
}

export interface CategoriesCategories {
  categoryCode: string;
  subcategoryCode: string;
}

export interface CategoryAttributes {
  categoryCode: string;
  id: Generated<Int8>;
  readyMealOption: boolean | null;
  reasonableAmount: number | null;
  sameAsBeforeOption: boolean | null;
  useInRecipes: number | null;
}

export interface CategoryLocals {
  categoryCode: string;
  id: Generated<Int8>;
  localeId: string;
  name: string;
  simpleName: string;
  tags: Generated<string>;
  version: string;
}

export interface CategoryPortionSizeMethods {
  categoryLocalId: Int8;
  conversionFactor: number;
  description: string;
  id: Generated<Int8>;
  method: string;
  orderBy: Int8;
  parameters: Generated<string>;
  useForRecipes: boolean;
}

export interface DrinkwareScales {
  baseImageUrl: string;
  choiceId: Int8;
  drinkwareSetId: string;
  emptyLevel: number;
  fullLevel: number;
  height: number;
  id: Generated<Int8>;
  label: string | null;
  overlayImageUrl: string;
  width: number;
}

export interface DrinkwareScalesV2 {
  baseImageId: Int8;
  choiceId: Int8;
  drinkwareSetId: string;
  id: Generated<Int8>;
  label: string | null;
  outlineCoordinates: string;
  volumeMethod: Generated<string>;
  volumeSamples: string;
  volumeSamplesNormalised: string;
}

export interface DrinkwareSets {
  description: string;
  id: string;
  imageMapId: string;
}

export interface DrinkwareVolumeSamples {
  drinkwareScaleId: Int8;
  fill: number;
  id: Generated<Int8>;
  volume: number;
}

export interface FoodAttributes {
  foodCode: string;
  id: Generated<Int8>;
  readyMealOption: boolean | null;
  reasonableAmount: number | null;
  sameAsBeforeOption: boolean | null;
  useInRecipes: number | null;
}

export interface FoodGroupLocals {
  foodGroupId: Int8;
  id: Generated<Int8>;
  localeId: string;
  name: string;
}

export interface FoodGroups {
  id: Generated<Int8>;
  name: string;
}

export interface FoodLocals {
  altNames: Generated<string>;
  foodCode: string;
  id: Generated<Int8>;
  localeId: string;
  name: string | null;
  simpleName: string | null;
  tags: Generated<string>;
  version: string;
}

export interface FoodPortionSizeMethods {
  conversionFactor: number;
  description: string;
  foodLocalId: Int8;
  id: Generated<Int8>;
  method: string;
  orderBy: Int8;
  parameters: Generated<string>;
  useForRecipes: boolean;
}

export interface Foods {
  code: string;
  foodGroupId: Int8;
  name: string;
  version: string;
}

export interface FoodsCategories {
  categoryCode: string;
  foodCode: string;
}

export interface FoodsLocalLists {
  foodCode: string;
  localeId: string;
}

export interface FoodsNutrients {
  foodLocalId: Int8;
  nutrientTableRecordId: Int8;
}

export interface FoodsRestrictions {
  foodCode: string;
  localeId: string;
}

export interface GuideImageObjects {
  guideImageId: string;
  id: Generated<Int8>;
  imageMapObjectId: Int8;
  label: string | null;
  weight: number;
}

export interface GuideImages {
  description: string;
  id: string;
  imageMapId: string;
  selectionImageId: Int8;
}

export interface ImageMapObjects {
  description: string;
  id: Int8;
  imageMapId: string;
  label: string | null;
  navigationIndex: number;
  outlineCoordinates: string;
  overlayImageId: Int8 | null;
}

export interface ImageMaps {
  baseImageId: Int8;
  description: string;
  id: string;
}

export interface Locales {
  adminLanguageId: string;
  countryFlagCode: string;
  englishName: string;
  foodIndexEnabled: Generated<boolean>;
  foodIndexLanguageBackendId: Generated<string>;
  id: string;
  localName: string;
  prototypeLocaleId: string | null;
  respondentLanguageId: string;
  textDirection: Generated<string>;
}

export interface NdnsCompoundFoodGroups {
  description: string;
  id: number;
}

export interface NdnsCompoundFoodGroupsData {
  compoundFoodGroupId: number;
  ndnsFoodCode: number;
  proportion: number;
}

export interface NutrientTableCsvMapping {
  descriptionColumnOffset: number;
  idColumnOffset: number;
  localDescriptionColumnOffset: number | null;
  nutrientTableId: string;
  rowOffset: number;
}

export interface NutrientTableCsvMappingFields {
  columnOffset: number;
  fieldName: string;
  id: Generated<Int8>;
  nutrientTableId: string;
}

export interface NutrientTableCsvMappingNutrients {
  columnOffset: number;
  id: Generated<Int8>;
  nutrientTableId: string;
  nutrientTypeId: Int8;
}

export interface NutrientTableRecordFields {
  id: Generated<Int8>;
  name: string;
  nutrientTableRecordId: Int8;
  value: string;
}

export interface NutrientTableRecordNutrients {
  id: Generated<Int8>;
  nutrientTableRecordId: Int8;
  nutrientTypeId: Int8 | null;
  unitsPer100g: number;
}

export interface NutrientTableRecords {
  id: Generated<Int8>;
  localName: string | null;
  name: string;
  nutrientTableId: string;
  nutrientTableRecordId: string;
}

export interface NutrientTables {
  description: string;
  id: string;
}

export interface NutrientTypeInKcal {
  id: Generated<Int8>;
  kcalPerUnit: number;
  nutrientTypeId: Int8;
}

export interface NutrientTypes {
  description: string;
  id: Int8;
  unitId: Int8;
}

export interface NutrientUnits {
  description: string;
  id: Int8;
  symbol: string;
}

export interface PhysicalActivityLevels {
  coefficient: number;
  id: Generated<Int8>;
  name: string;
}

export interface ProcessedImages {
  createdAt: Timestamp;
  id: Generated<Int8>;
  path: string;
  purpose: number;
  sourceId: Int8;
}

export interface RecipeFoods {
  code: string;
  createdAt: Timestamp;
  id: Generated<Int8>;
  localeId: string;
  name: string;
  recipeWord: string;
  synonymsId: Int8 | null;
  updatedAt: Timestamp;
}

export interface RecipeFoodsSteps {
  categoryCode: string | null;
  code: string;
  createdAt: Timestamp;
  description: string;
  id: Generated<Int8>;
  localeId: Generated<string>;
  name: string;
  order: number;
  recipeFoodsId: Int8;
  repeatable: Generated<boolean>;
  required: Generated<boolean>;
  updatedAt: Timestamp;
}

export interface SequelizeMeta {
  name: string;
}

export interface SourceImageKeywords {
  keyword: string;
  sourceImageId: Int8;
}

export interface SourceImages {
  id: Generated<Int8>;
  path: string;
  thumbnailPath: string;
  uploadedAt: Timestamp;
  uploader: string;
}

export interface SplitLists {
  firstWord: string;
  id: Generated<Int8>;
  localeId: string;
  words: string;
}

export interface SplitWords {
  id: Generated<Int8>;
  localeId: string;
  words: string;
}

export interface StandardUnits {
  createdAt: Timestamp;
  estimateIn: string;
  howMany: string;
  id: string;
  name: string;
  updatedAt: Timestamp;
}

export interface SynonymSets {
  id: Generated<Int8>;
  localeId: string;
  synonyms: string;
}

export interface DB {
  asServedImages: AsServedImages;
  asServedSets: AsServedSets;
  associatedFoods: AssociatedFoods;
  attributeDefaults: AttributeDefaults;
  brands: Brands;
  categories: Categories;
  categoriesCategories: CategoriesCategories;
  categoryAttributes: CategoryAttributes;
  categoryLocals: CategoryLocals;
  categoryPortionSizeMethods: CategoryPortionSizeMethods;
  drinkwareScales: DrinkwareScales;
  drinkwareScalesV2: DrinkwareScalesV2;
  drinkwareSets: DrinkwareSets;
  drinkwareVolumeSamples: DrinkwareVolumeSamples;
  foodAttributes: FoodAttributes;
  foodGroupLocals: FoodGroupLocals;
  foodGroups: FoodGroups;
  foodLocals: FoodLocals;
  foodPortionSizeMethods: FoodPortionSizeMethods;
  foods: Foods;
  foodsCategories: FoodsCategories;
  foodsLocalLists: FoodsLocalLists;
  foodsNutrients: FoodsNutrients;
  foodsRestrictions: FoodsRestrictions;
  guideImageObjects: GuideImageObjects;
  guideImages: GuideImages;
  imageMapObjects: ImageMapObjects;
  imageMaps: ImageMaps;
  locales: Locales;
  ndnsCompoundFoodGroups: NdnsCompoundFoodGroups;
  ndnsCompoundFoodGroupsData: NdnsCompoundFoodGroupsData;
  nutrientTableCsvMapping: NutrientTableCsvMapping;
  nutrientTableCsvMappingFields: NutrientTableCsvMappingFields;
  nutrientTableCsvMappingNutrients: NutrientTableCsvMappingNutrients;
  nutrientTableRecordFields: NutrientTableRecordFields;
  nutrientTableRecordNutrients: NutrientTableRecordNutrients;
  nutrientTableRecords: NutrientTableRecords;
  nutrientTables: NutrientTables;
  nutrientTypeInKcal: NutrientTypeInKcal;
  nutrientTypes: NutrientTypes;
  nutrientUnits: NutrientUnits;
  physicalActivityLevels: PhysicalActivityLevels;
  processedImages: ProcessedImages;
  recipeFoods: RecipeFoods;
  recipeFoodsSteps: RecipeFoodsSteps;
  sequelizeMeta: SequelizeMeta;
  sourceImageKeywords: SourceImageKeywords;
  sourceImages: SourceImages;
  splitLists: SplitLists;
  splitWords: SplitWords;
  standardUnits: StandardUnits;
  synonymSets: SynonymSets;
}
