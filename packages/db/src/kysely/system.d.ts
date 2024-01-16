import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = ColumnType<JsonValue, string, string>;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface ClientErrorReports {
  created_at: Timestamp;
  id: Generated<Int8>;
  new: Generated<boolean>;
  stack_trace: string;
  survey_id: Int8 | null;
  survey_state_json: string;
  updated_at: Timestamp;
  user_id: Int8 | null;
}

export interface ExternalTestUsers {
  confirmation_code: string;
  external_user_id: string;
  id: Generated<number>;
  user_id: Int8;
}

export interface FeedbackSchemes {
  cards: Generated<string>;
  created_at: Timestamp;
  demographic_groups: Generated<string>;
  henry_coefficients: Generated<string>;
  id: Generated<Int8>;
  meals: string;
  name: string;
  outputs: string;
  owner_id: Int8 | null;
  physical_data_fields: Generated<string>;
  sections: string;
  top_foods: string;
  type: Generated<string>;
  updated_at: Timestamp;
  visibility: Generated<string>;
}

export interface FixedFoodRanking {
  food_code: string;
  id: Generated<number>;
  locale_id: string;
  rank: number;
}

export interface GenUserCounters {
  count: Generated<number>;
  created_at: Timestamp;
  survey_id: Int8;
  updated_at: Timestamp;
}

export interface Jobs {
  completed_at: Timestamp | null;
  created_at: Timestamp;
  download_url: string | null;
  download_url_expires_at: Timestamp | null;
  id: Generated<Int8>;
  message: string | null;
  params: string | null;
  progress: number | null;
  stack_trace: string | null;
  started_at: Timestamp | null;
  successful: boolean | null;
  type: string;
  updated_at: Timestamp;
  user_id: Int8 | null;
}

export interface Languages {
  code: string;
  country_flag_code: string;
  created_at: Timestamp;
  english_name: string;
  id: Generated<Int8>;
  local_name: string;
  owner_id: Int8 | null;
  text_direction: Generated<string>;
  updated_at: Timestamp;
  visibility: Generated<string>;
}

export interface LanguageTranslations {
  application: string;
  created_at: Timestamp;
  id: Generated<Int8>;
  language_id: Int8;
  messages: string;
  section: string;
  updated_at: Timestamp;
}

export interface Locales {
  admin_language_id: string;
  code: string;
  country_flag_code: string;
  created_at: Timestamp;
  english_name: string;
  food_index_enabled: Generated<boolean>;
  food_index_language_backend_id: Generated<string>;
  id: Generated<Int8>;
  local_name: string;
  owner_id: Int8 | null;
  prototype_locale_id: string | null;
  respondent_language_id: string;
  text_direction: Generated<string>;
  updated_at: Timestamp;
  visibility: Generated<string>;
}

export interface MfaAuthenticators {
  backed_up: boolean;
  counter: Int8;
  created_at: Timestamp;
  device_id: Int8;
  device_type: string;
  id: string;
  public_key: Buffer;
  transports: string;
  updated_at: Timestamp;
}

export interface MfaDevices {
  created_at: Timestamp;
  id: Generated<Int8>;
  name: string;
  preferred: Generated<boolean>;
  provider: string;
  secret: string;
  updated_at: Timestamp;
  user_id: Int8;
}

export interface MissingFoods {
  brand: string;
  description: string;
  id: Generated<Int8>;
  leftovers: string;
  name: string;
  portion_size: string;
  submitted_at: Timestamp;
  survey_id: Int8;
  user_id: Int8;
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

export interface PairwiseAssociationsCoOccurrences {
  antecedent_food_code: string;
  consequent_food_code: string;
  locale_id: string;
  occurrences: number;
}

export interface PairwiseAssociationsOccurrences {
  food_code: string;
  locale_id: string;
  occurrences: number;
}

export interface PairwiseAssociationsState {
  last_submission_time: Generated<Timestamp>;
}

export interface PairwiseAssociationsTransactionsCount {
  locale_id: string;
  transactions_count: number;
}

export interface PermissionRole {
  created_at: Timestamp;
  permission_id: Int8;
  role_id: Int8;
  updated_at: Timestamp;
}

export interface Permissions {
  created_at: Timestamp;
  description: string | null;
  display_name: string;
  id: Generated<Int8>;
  name: string;
  updated_at: Timestamp;
}

export interface PermissionUser {
  created_at: Timestamp;
  permission_id: Int8;
  updated_at: Timestamp;
  user_id: Int8;
}

export interface PopularityCounters {
  counter: number;
  food_code: string;
}

export interface RefreshTokens {
  created_at: Timestamp;
  expires_at: Timestamp;
  id: string;
  revoked: Generated<boolean>;
  updated_at: Timestamp;
  user_id: Int8;
}

export interface Roles {
  created_at: Timestamp;
  description: string | null;
  display_name: string;
  id: Generated<Int8>;
  name: string;
  updated_at: Timestamp;
}

export interface RoleUser {
  created_at: Timestamp;
  role_id: Int8;
  updated_at: Timestamp;
  user_id: Int8;
}

export interface SequelizeMeta {
  name: string;
}

export interface ShortUrls {
  long_url: string;
  short_url: string;
}

export interface SigninLog {
  date: Timestamp;
  id: Generated<Int8>;
  message: string | null;
  provider: string;
  provider_key: string;
  remote_address: string | null;
  successful: boolean;
  user_agent: string | null;
  user_id: Int8 | null;
}

export interface Surveys {
  allow_gen_users: boolean;
  auth_captcha: Generated<boolean>;
  auth_url_domain_override: string | null;
  auth_url_token_charset: string | null;
  auth_url_token_length: number | null;
  created_at: Timestamp;
  end_date: Timestamp;
  feedback_scheme_id: Int8 | null;
  gen_user_key: string | null;
  id: Generated<Int8>;
  locale_id: Int8;
  maximum_daily_submissions: Generated<number>;
  maximum_total_submissions: number | null;
  minimum_submission_interval: Generated<number>;
  name: string;
  number_of_submissions_for_feedback: Generated<number>;
  originating_url: string | null;
  owner_id: Int8 | null;
  search_match_score_weight: Generated<number>;
  search_sorting_algorithm: Generated<string>;
  slug: string;
  start_date: Timestamp;
  state: string;
  store_user_session_on_server: boolean;
  submission_notification_url: string | null;
  support_email: string;
  survey_monkey_url: string | null;
  survey_scheme_id: Int8;
  survey_scheme_overrides: string | null;
  suspension_reason: string | null;
  updated_at: Timestamp;
  user_custom_fields: Generated<boolean>;
  user_personal_identifiers: Generated<boolean>;
}

export interface SurveySchemePrompts {
  created_at: Timestamp;
  id: Generated<Int8>;
  name: string;
  prompt: string | null;
  prompt_id: string;
  updated_at: Timestamp;
}

export interface SurveySchemes {
  created_at: Timestamp;
  data_export: string | null;
  id: Generated<Int8>;
  meals: string | null;
  name: string;
  owner_id: Int8 | null;
  prompts: string | null;
  type: Generated<string>;
  updated_at: Timestamp;
  visibility: Generated<string>;
}

export interface SurveySubmissionCustomFields {
  id: string;
  name: string;
  survey_submission_id: string;
  value: string;
}

export interface SurveySubmissionFields {
  field_name: string;
  food_id: string;
  id: string;
  value: string;
}

export interface SurveySubmissionFoodCustomFields {
  food_id: string;
  id: string;
  name: string;
  value: string;
}

export interface SurveySubmissionFoods {
  barcode: string | null;
  brand: string | null;
  code: string;
  english_name: string;
  food_group_english_name: string;
  food_group_id: Int8;
  food_group_local_name: string | null;
  id: string;
  index: number;
  local_name: string | null;
  meal_id: string;
  nutrient_table_code: string;
  nutrient_table_id: string;
  parent_id: string | null;
  portion_size_method_id: string;
  ready_meal: boolean;
  reasonable_amount: boolean;
  search_term: string;
}

export interface SurveySubmissionMealCustomFields {
  id: string;
  meal_id: string;
  name: string;
  value: string;
}

export interface SurveySubmissionMeals {
  duration: number | null;
  hours: number;
  id: string;
  minutes: number;
  name: string | null;
  survey_submission_id: string;
}

export interface SurveySubmissionMissingFoods {
  barcode: string | null;
  brand: string | null;
  description: string | null;
  id: string;
  index: number;
  leftovers: string | null;
  meal_id: string;
  name: string | null;
  parent_id: string | null;
  portion_size: string | null;
}

export interface SurveySubmissionNutrients {
  amount: number;
  food_id: string;
  id: string;
  nutrient_type_id: Int8;
}

export interface SurveySubmissionPortionSizeFields {
  food_id: string;
  id: string;
  name: string;
  value: string;
}

export interface SurveySubmissions {
  created_at: Timestamp;
  end_time: Timestamp;
  id: string;
  log: string | null;
  start_time: Timestamp;
  submission_time: Timestamp;
  survey_id: Int8;
  updated_at: Timestamp;
  user_agent: string | null;
  user_id: Int8;
  ux_session_id: string;
}

export interface SurveysUxEventsSettings {
  created_at: Timestamp;
  enable_associated_foods_events: boolean;
  enable_search_events: boolean;
  survey_id: Int8;
  updated_at: Timestamp;
}

export interface Tasks {
  active: Generated<boolean>;
  created_at: Timestamp;
  cron: Generated<string>;
  description: string | null;
  id: Generated<Int8>;
  job: string;
  name: string;
  params: string | null;
  updated_at: Timestamp;
}

export interface UserCustomFields {
  id: Generated<Int8>;
  name: string;
  user_id: Int8;
  value: string;
}

export interface UserNotificationSchedule {
  datetime: Timestamp;
  id: Generated<Int8>;
  notification_type: string | null;
  survey_id: Int8 | null;
  user_id: Int8;
}

export interface UserPasswordResets {
  created_at: Timestamp;
  id: Generated<Int8>;
  token: string;
  updated_at: Timestamp;
  user_id: Int8;
}

export interface UserPasswords {
  password_hash: string;
  password_hasher: string;
  password_salt: string;
  user_id: Int8;
}

export interface UserPhysicalData {
  birthdate: Timestamp | null;
  height_cm: number | null;
  physical_activity_level_id: Int8 | null;
  sex: string | null;
  user_id: Int8;
  weight_kg: number | null;
  weight_target: string | null;
}

export interface Users {
  created_at: Timestamp;
  disabled_at: Timestamp | null;
  email: string | null;
  email_notifications: Generated<boolean>;
  id: Generated<Int8>;
  multi_factor_authentication: Generated<boolean>;
  name: string | null;
  phone: string | null;
  simple_name: string | null;
  sms_notifications: Generated<boolean>;
  updated_at: Timestamp;
  verified_at: Timestamp | null;
}

export interface UserSecurables {
  action: string;
  created_at: Timestamp;
  fields: string | null;
  securable_id: Int8;
  securable_type: string;
  updated_at: Timestamp;
  user_id: Int8;
}

export interface UserSubscriptions {
  created_at: Timestamp;
  id: Generated<Int8>;
  subscription: string;
  type: string;
  updated_at: Timestamp;
  user_id: Int8;
}

export interface UserSurveyAliases {
  created_at: Timestamp;
  id: Generated<Int8>;
  survey_id: Int8;
  updated_at: Timestamp;
  url_auth_token: string;
  user_id: Int8;
  username: string;
}

export interface UserSurveySessions {
  created_at: Timestamp;
  session_data: string;
  survey_id: Int8;
  updated_at: Timestamp;
  user_id: Int8;
}

export interface UxEvents {
  created: Generated<Timestamp>;
  data: Json;
  event_categories: string[];
  event_type: string;
  id: Generated<number>;
  local_timestamp: Int8 | null;
  session_id: string;
  user_id: Int8;
}

export interface DB {
  client_error_reports: ClientErrorReports;
  external_test_users: ExternalTestUsers;
  feedback_schemes: FeedbackSchemes;
  fixed_food_ranking: FixedFoodRanking;
  gen_user_counters: GenUserCounters;
  jobs: Jobs;
  language_translations: LanguageTranslations;
  languages: Languages;
  locales: Locales;
  mfa_authenticators: MfaAuthenticators;
  mfa_devices: MfaDevices;
  missing_foods: MissingFoods;
  nutrient_types: NutrientTypes;
  nutrient_units: NutrientUnits;
  pairwise_associations_co_occurrences: PairwiseAssociationsCoOccurrences;
  pairwise_associations_occurrences: PairwiseAssociationsOccurrences;
  pairwise_associations_state: PairwiseAssociationsState;
  pairwise_associations_transactions_count: PairwiseAssociationsTransactionsCount;
  permission_role: PermissionRole;
  permission_user: PermissionUser;
  permissions: Permissions;
  popularity_counters: PopularityCounters;
  refresh_tokens: RefreshTokens;
  role_user: RoleUser;
  roles: Roles;
  sequelize_meta: SequelizeMeta;
  short_urls: ShortUrls;
  signin_log: SigninLog;
  survey_scheme_prompts: SurveySchemePrompts;
  survey_schemes: SurveySchemes;
  survey_submission_custom_fields: SurveySubmissionCustomFields;
  survey_submission_fields: SurveySubmissionFields;
  survey_submission_food_custom_fields: SurveySubmissionFoodCustomFields;
  survey_submission_foods: SurveySubmissionFoods;
  survey_submission_meal_custom_fields: SurveySubmissionMealCustomFields;
  survey_submission_meals: SurveySubmissionMeals;
  survey_submission_missing_foods: SurveySubmissionMissingFoods;
  survey_submission_nutrients: SurveySubmissionNutrients;
  survey_submission_portion_size_fields: SurveySubmissionPortionSizeFields;
  survey_submissions: SurveySubmissions;
  surveys: Surveys;
  surveys_ux_events_settings: SurveysUxEventsSettings;
  tasks: Tasks;
  user_custom_fields: UserCustomFields;
  user_notification_schedule: UserNotificationSchedule;
  user_password_resets: UserPasswordResets;
  user_passwords: UserPasswords;
  user_physical_data: UserPhysicalData;
  user_securables: UserSecurables;
  user_subscriptions: UserSubscriptions;
  user_survey_aliases: UserSurveyAliases;
  user_survey_sessions: UserSurveySessions;
  users: Users;
  ux_events: UxEvents;
}
