import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface AsServedImages {
  as_served_set_id: string;
  id: Generated<Int8>;
  image_id: Int8;
  thumbnail_image_id: Int8;
  weight: number;
}

export interface AsServedSets {
  description: string;
  id: string;
  selection_image_id: Int8;
}

export interface AssociatedFoods {
  associated_category_code: string | null;
  associated_food_code: string | null;
  food_code: string;
  generic_name: string;
  id: Generated<Int8>;
  link_as_main: boolean;
  locale_id: string;
  multiple: boolean;
  order_by: Int8;
  text: string;
}

export interface AttributeDefaults {
  id: Generated<Int8>;
  ready_meal_option: boolean | null;
  reasonable_amount: number | null;
  same_as_before_option: boolean | null;
  use_in_recipes: number | null;
}

export interface Brands {
  food_code: string;
  id: Generated<Int8>;
  locale_id: string;
  name: string;
}

export interface Categories {
  code: string;
  is_hidden: boolean;
  name: string;
  version: string;
}

export interface CategoriesCategories {
  category_code: string;
  subcategory_code: string;
}

export interface CategoryAttributes {
  category_code: string;
  id: Generated<Int8>;
  ready_meal_option: boolean | null;
  reasonable_amount: number | null;
  same_as_before_option: boolean | null;
  use_in_recipes: number | null;
}

export interface CategoryLocals {
  category_code: string;
  id: Generated<Int8>;
  locale_id: string;
  name: string;
  simple_name: string;
  version: string;
}

export interface CategoryPortionSizeMethodParams {
  id: Generated<Int8>;
  name: string;
  portion_size_method_id: Int8;
  value: string;
}

export interface CategoryPortionSizeMethods {
  category_local_id: Int8;
  conversion_factor: number;
  description: string;
  id: Generated<Int8>;
  image_url: string;
  method: string;
  order_by: Int8;
  use_for_recipes: boolean;
}

export interface DrinkwareScales {
  base_image_url: string;
  choice_id: Int8;
  drinkware_set_id: string;
  empty_level: number;
  full_level: number;
  height: number;
  id: Generated<Int8>;
  label: string | null;
  overlay_image_url: string;
  width: number;
}

export interface DrinkwareScalesV2 {
  base_image_id: Int8;
  choice_id: Int8;
  drinkware_set_id: string;
  id: Generated<Int8>;
  label: string | null;
  outline_coordinates: string;
  volume_samples: string;
}

export interface DrinkwareSets {
  description: string;
  id: string;
  image_map_id: string;
}

export interface DrinkwareVolumeSamples {
  drinkware_scale_id: Int8;
  fill: number;
  id: Generated<Int8>;
  volume: number;
}

export interface FoodAttributes {
  food_code: string;
  id: Generated<Int8>;
  ready_meal_option: boolean | null;
  reasonable_amount: number | null;
  same_as_before_option: boolean | null;
  use_in_recipes: number | null;
}

export interface FoodGroupLocals {
  food_group_id: Int8;
  id: Generated<Int8>;
  locale_id: string;
  name: string;
}

export interface FoodGroups {
  id: Generated<Int8>;
  name: string;
}

export interface FoodLocals {
  food_code: string;
  id: Generated<Int8>;
  locale_id: string;
  name: string | null;
  simple_name: string | null;
  version: string;
}

export interface FoodPortionSizeMethodParams {
  id: Generated<Int8>;
  name: string;
  portion_size_method_id: Int8;
  value: string;
}

export interface FoodPortionSizeMethods {
  conversion_factor: number;
  description: string;
  food_local_id: Int8;
  id: Generated<Int8>;
  image_url: string;
  method: string;
  order_by: Int8;
  use_for_recipes: boolean;
}

export interface Foods {
  code: string;
  food_group_id: Int8;
  name: string;
  version: string;
}

export interface FoodsCategories {
  category_code: string;
  food_code: string;
}

export interface FoodsLocalLists {
  food_code: string;
  locale_id: string;
}

export interface FoodsNutrients {
  food_local_id: Int8;
  nutrient_table_record_id: Int8;
}

export interface FoodsRestrictions {
  food_code: string;
  locale_id: string;
}

export interface GuideImageObjects {
  guide_image_id: string;
  id: Generated<Int8>;
  image_map_object_id: Int8;
  label: string | null;
  weight: number;
}

export interface GuideImages {
  description: string;
  id: string;
  image_map_id: string;
  selection_image_id: Int8;
}

export interface ImageMapObjects {
  description: string;
  id: Int8;
  image_map_id: string;
  label: string | null;
  navigation_index: number;
  outline_coordinates: string;
  overlay_image_id: Int8 | null;
}

export interface ImageMaps {
  base_image_id: Int8;
  description: string;
  id: string;
}

export interface Locales {
  admin_language_id: string;
  country_flag_code: string;
  english_name: string;
  food_index_enabled: Generated<boolean>;
  food_index_language_backend_id: Generated<string>;
  id: string;
  local_name: string;
  prototype_locale_id: string | null;
  respondent_language_id: string;
  text_direction: Generated<string>;
}

export interface NdnsCompoundFoodGroups {
  description: string;
  id: number;
}

export interface NdnsCompoundFoodGroupsData {
  compound_food_group_id: number;
  ndns_food_code: number;
  proportion: number;
}

export interface NutrientTableCsvMapping {
  description_column_offset: number;
  id_column_offset: number;
  local_description_column_offset: number | null;
  nutrient_table_id: string;
  row_offset: number;
}

export interface NutrientTableCsvMappingFields {
  column_offset: number;
  field_name: string;
  id: Generated<Int8>;
  nutrient_table_id: string;
}

export interface NutrientTableCsvMappingNutrients {
  column_offset: number;
  id: Generated<Int8>;
  nutrient_table_id: string;
  nutrient_type_id: Int8;
}

export interface NutrientTableRecordFields {
  id: Generated<Int8>;
  name: string;
  nutrient_table_record_id: Int8;
  value: string;
}

export interface NutrientTableRecordNutrients {
  id: Generated<Int8>;
  nutrient_table_record_id: Int8;
  nutrient_type_id: Int8 | null;
  units_per_100g: number;
}

export interface NutrientTableRecords {
  id: Generated<Int8>;
  local_name: string | null;
  name: string;
  nutrient_table_id: string;
  nutrient_table_record_id: string;
}

export interface NutrientTables {
  description: string;
  id: string;
}

export interface NutrientTypeInKcal {
  id: Generated<Int8>;
  kcal_per_unit: number;
  nutrient_type_id: Int8;
}

export interface NutrientTypes {
  description: string;
  id: Int8;
  unit_id: Int8;
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
  created_at: Timestamp;
  id: Generated<Int8>;
  path: string;
  purpose: number;
  source_id: Int8;
}

export interface RecipeFoods {
  code: string;
  created_at: Timestamp;
  id: Generated<Int8>;
  locale_id: string;
  name: string;
  recipe_word: string;
  synonyms_id: Int8 | null;
  updated_at: Timestamp;
}

export interface RecipeFoodsSteps {
  category_code: string | null;
  code: string;
  created_at: Timestamp;
  description: string;
  id: Generated<Int8>;
  locale_id: Generated<string>;
  name: string;
  order: number;
  recipe_foods_id: Int8;
  repeatable: Generated<boolean>;
  updated_at: Timestamp;
}

export interface SequelizeMeta {
  name: string;
}

export interface SourceImageKeywords {
  keyword: string;
  source_image_id: Int8;
}

export interface SourceImages {
  id: Generated<Int8>;
  path: string;
  thumbnail_path: string;
  uploaded_at: Timestamp;
  uploader: string;
}

export interface SplitLists {
  first_word: string;
  id: Generated<Int8>;
  locale_id: string;
  words: string;
}

export interface SplitWords {
  id: Generated<Int8>;
  locale_id: string;
  words: string;
}

export interface StandardUnits {
  created_at: Timestamp;
  estimate_in: string;
  how_many: string;
  id: string;
  name: string;
  updated_at: Timestamp;
}

export interface StandardUnitsBackup {
  created_at: Timestamp | null;
  estimate_in: string | null;
  how_many: string | null;
  id: string | null;
  name: string | null;
  updated_at: Timestamp | null;
}

export interface SynonymSets {
  id: Generated<Int8>;
  locale_id: string;
  synonyms: string;
}

export interface DB {
  as_served_images: AsServedImages;
  as_served_sets: AsServedSets;
  associated_foods: AssociatedFoods;
  attribute_defaults: AttributeDefaults;
  brands: Brands;
  categories: Categories;
  categories_categories: CategoriesCategories;
  category_attributes: CategoryAttributes;
  category_locals: CategoryLocals;
  category_portion_size_method_params: CategoryPortionSizeMethodParams;
  category_portion_size_methods: CategoryPortionSizeMethods;
  drinkware_scales: DrinkwareScales;
  drinkware_scales_v2: DrinkwareScalesV2;
  drinkware_sets: DrinkwareSets;
  drinkware_volume_samples: DrinkwareVolumeSamples;
  food_attributes: FoodAttributes;
  food_group_locals: FoodGroupLocals;
  food_groups: FoodGroups;
  food_locals: FoodLocals;
  food_portion_size_method_params: FoodPortionSizeMethodParams;
  food_portion_size_methods: FoodPortionSizeMethods;
  foods: Foods;
  foods_categories: FoodsCategories;
  foods_local_lists: FoodsLocalLists;
  foods_nutrients: FoodsNutrients;
  foods_restrictions: FoodsRestrictions;
  guide_image_objects: GuideImageObjects;
  guide_images: GuideImages;
  image_map_objects: ImageMapObjects;
  image_maps: ImageMaps;
  locales: Locales;
  ndns_compound_food_groups: NdnsCompoundFoodGroups;
  ndns_compound_food_groups_data: NdnsCompoundFoodGroupsData;
  nutrient_table_csv_mapping: NutrientTableCsvMapping;
  nutrient_table_csv_mapping_fields: NutrientTableCsvMappingFields;
  nutrient_table_csv_mapping_nutrients: NutrientTableCsvMappingNutrients;
  nutrient_table_record_fields: NutrientTableRecordFields;
  nutrient_table_record_nutrients: NutrientTableRecordNutrients;
  nutrient_table_records: NutrientTableRecords;
  nutrient_tables: NutrientTables;
  nutrient_type_in_kcal: NutrientTypeInKcal;
  nutrient_types: NutrientTypes;
  nutrient_units: NutrientUnits;
  physical_activity_levels: PhysicalActivityLevels;
  processed_images: ProcessedImages;
  recipe_foods: RecipeFoods;
  recipe_foods_steps: RecipeFoodsSteps;
  sequelize_meta: SequelizeMeta;
  source_image_keywords: SourceImageKeywords;
  source_images: SourceImages;
  split_lists: SplitLists;
  split_words: SplitWords;
  standard_units: StandardUnits;
  standard_units_backup: StandardUnitsBackup;
  synonym_sets: SynonymSets;
}
