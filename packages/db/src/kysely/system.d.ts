import type { ColumnType } from 'kysely';

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Int8 = ColumnType<string, bigint | number | string, bigint | number | string>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface ClientErrorReports {
  createdAt: Timestamp;
  id: Generated<Int8>;
  new: Generated<boolean>;
  stackTrace: string;
  surveyId: Int8 | null;
  surveyStateJson: string;
  updatedAt: Timestamp;
  userId: Int8 | null;
}

export interface ExternalTestUsers {
  confirmationCode: string;
  externalUserId: string;
  id: Generated<number>;
  userId: Int8;
}

export interface FeedbackSchemes {
  cards: Generated<string>;
  createdAt: Timestamp;
  demographicGroups: Generated<string>;
  henryCoefficients: Generated<string>;
  id: Generated<Int8>;
  meals: string;
  name: string;
  outputs: string;
  ownerId: Int8 | null;
  physicalDataFields: Generated<string>;
  sections: string;
  topFoods: string;
  type: Generated<string>;
  updatedAt: Timestamp;
  visibility: Generated<string>;
}

export interface FixedFoodRanking {
  foodCode: string;
  id: Generated<number>;
  localeId: string;
  rank: number;
}

export interface GenUserCounters {
  count: Generated<number>;
  createdAt: Timestamp;
  surveyId: Int8;
  updatedAt: Timestamp;
}

export interface Jobs {
  completedAt: Timestamp | null;
  createdAt: Timestamp;
  downloadUrl: string | null;
  downloadUrlExpiresAt: Timestamp | null;
  id: Generated<Int8>;
  message: string | null;
  params: string | null;
  progress: number | null;
  stackTrace: string | null;
  startedAt: Timestamp | null;
  successful: boolean | null;
  type: string;
  updatedAt: Timestamp;
  userId: Int8 | null;
}

export interface Languages {
  code: string;
  countryFlagCode: string;
  createdAt: Timestamp;
  englishName: string;
  id: Generated<Int8>;
  localName: string;
  ownerId: Int8 | null;
  textDirection: Generated<string>;
  updatedAt: Timestamp;
  visibility: Generated<string>;
}

export interface LanguageTranslations {
  application: string;
  createdAt: Timestamp;
  id: Generated<Int8>;
  languageId: Int8;
  messages: string;
  section: string;
  updatedAt: Timestamp;
}

export interface Locales {
  adminLanguageId: string;
  code: string;
  countryFlagCode: string;
  createdAt: Timestamp;
  englishName: string;
  foodIndexEnabled: Generated<boolean>;
  foodIndexLanguageBackendId: Generated<string>;
  id: Generated<Int8>;
  localName: string;
  ownerId: Int8 | null;
  respondentLanguageId: string;
  textDirection: Generated<string>;
  updatedAt: Timestamp;
  visibility: Generated<string>;
}

export interface MfaAuthenticators {
  backedUp: boolean;
  counter: Int8;
  createdAt: Timestamp;
  deviceId: Int8;
  deviceType: string;
  id: string;
  publicKey: Buffer;
  transports: string;
  updatedAt: Timestamp;
}

export interface MfaDevices {
  createdAt: Timestamp;
  id: Generated<Int8>;
  name: string;
  preferred: Generated<boolean>;
  provider: string;
  secret: string;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface MissingFoods {
  brand: string;
  description: string;
  id: Generated<Int8>;
  leftovers: string;
  name: string;
  portionSize: string;
  submittedAt: Timestamp;
  surveyId: Int8;
  userId: Int8;
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

export interface PairwiseAssociationsCoOccurrences {
  antecedentFoodCode: string;
  consequentFoodCode: string;
  localeId: string;
  occurrences: number;
}

export interface PairwiseAssociationsOccurrences {
  foodCode: string;
  localeId: string;
  multiplier: number | null;
  occurrences: number;
}

export interface PairwiseAssociationsState {
  lastSubmissionTime: Generated<Timestamp>;
}

export interface PairwiseAssociationsTransactionsCount {
  localeId: string;
  transactionsCount: number;
}

export interface PermissionRole {
  createdAt: Timestamp;
  permissionId: Int8;
  roleId: Int8;
  updatedAt: Timestamp;
}

export interface Permissions {
  createdAt: Timestamp;
  description: string | null;
  displayName: string;
  id: Generated<Int8>;
  name: string;
  updatedAt: Timestamp;
}

export interface PermissionUser {
  createdAt: Timestamp;
  permissionId: Int8;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface PersonalAccessTokens {
  createdAt: Timestamp;
  expiresAt: Timestamp | null;
  id: Generated<Int8>;
  name: string;
  revoked: Generated<boolean>;
  scopes: string | null;
  token: string;
  updatedAt: Timestamp;
  usedAt: Timestamp | null;
  userId: Int8;
}

export interface PopularityCounters {
  counter: number;
  foodCode: string;
}

export interface RefreshTokens {
  createdAt: Timestamp;
  expiresAt: Timestamp;
  id: string;
  revoked: Generated<boolean>;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface Roles {
  createdAt: Timestamp;
  description: string | null;
  displayName: string;
  id: Generated<Int8>;
  name: string;
  updatedAt: Timestamp;
}

export interface RoleUser {
  createdAt: Timestamp;
  roleId: Int8;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface SequelizeMeta {
  name: string;
}

export interface ShortUrls {
  longUrl: string;
  shortUrl: string;
}

export interface SigninLog {
  date: Timestamp;
  id: Generated<Int8>;
  message: string | null;
  provider: string;
  providerKey: string;
  remoteAddress: string | null;
  successful: boolean;
  userAgent: string | null;
  userId: Int8 | null;
}

export interface Surveys {
  allowGenUsers: boolean;
  authCaptcha: Generated<boolean>;
  authUrlDomainOverride: string | null;
  authUrlTokenCharset: string | null;
  authUrlTokenLength: number | null;
  createdAt: Timestamp;
  endDate: Timestamp;
  feedbackSchemeId: Int8 | null;
  genUserKey: string | null;
  id: Generated<Int8>;
  localeId: Int8;
  maximumDailySubmissions: Generated<number>;
  maximumTotalSubmissions: number | null;
  minimumSubmissionInterval: Generated<number>;
  name: string;
  notifications: Generated<string>;
  numberOfSubmissionsForFeedback: Generated<number>;
  originatingUrl: string | null;
  ownerId: Int8 | null;
  searchSettings: string | null;
  sessionLifetime: Generated<string>;
  slug: string;
  startDate: Timestamp;
  state: string;
  storeUserSessionOnServer: boolean;
  supportEmail: string;
  surveyMonkeyUrl: string | null;
  surveySchemeId: Int8;
  surveySchemeOverrides: string | null;
  suspensionReason: string | null;
  updatedAt: Timestamp;
  userCustomFields: Generated<boolean>;
  userPersonalIdentifiers: Generated<boolean>;
}

export interface SurveySchemePrompts {
  createdAt: Timestamp;
  id: Generated<Int8>;
  name: string;
  prompt: string | null;
  promptId: string;
  updatedAt: Timestamp;
}

export interface SurveySchemes {
  createdAt: Timestamp;
  dataExport: string | null;
  id: Generated<Int8>;
  meals: string | null;
  name: string;
  ownerId: Int8 | null;
  prompts: string | null;
  type: Generated<string>;
  updatedAt: Timestamp;
  visibility: Generated<string>;
}

export interface SurveySubmissionCustomFields {
  id: string;
  name: string;
  surveySubmissionId: string;
  value: string;
}

export interface SurveySubmissionFields {
  fieldName: string;
  foodId: string;
  id: string;
  value: string;
}

export interface SurveySubmissionFoodCustomFields {
  foodId: string;
  id: string;
  name: string;
  value: string;
}

export interface SurveySubmissionFoods {
  barcode: string | null;
  brand: string | null;
  code: string;
  englishName: string;
  foodGroupEnglishName: string;
  foodGroupId: Int8;
  foodGroupLocalName: string | null;
  id: string;
  index: number;
  localName: string | null;
  mealId: string;
  nutrientTableCode: string;
  nutrientTableId: string;
  parentId: string | null;
  portionSizeMethodId: string;
  readyMeal: boolean;
  reasonableAmount: boolean;
  searchTerm: string;
}

export interface SurveySubmissionMealCustomFields {
  id: string;
  mealId: string;
  name: string;
  value: string;
}

export interface SurveySubmissionMeals {
  duration: number | null;
  hours: number;
  id: string;
  minutes: number;
  name: string | null;
  surveySubmissionId: string;
}

export interface SurveySubmissionMissingFoods {
  barcode: string | null;
  brand: string | null;
  description: string | null;
  id: string;
  index: number;
  leftovers: string | null;
  mealId: string;
  name: string | null;
  parentId: string | null;
  portionSize: string | null;
}

export interface SurveySubmissionNutrients {
  amount: number;
  foodId: string;
  id: string;
  nutrientTypeId: Int8;
}

export interface SurveySubmissionPortionSizeFields {
  foodId: string;
  id: string;
  name: string;
  value: string;
}

export interface SurveySubmissions {
  createdAt: Timestamp;
  endTime: Timestamp;
  id: string;
  log: string | null;
  sessionId: string;
  startTime: Timestamp;
  submissionTime: Timestamp;
  surveyId: Int8;
  updatedAt: Timestamp;
  userAgent: string | null;
  userId: Int8;
}

export interface SurveysUxEventsSettings {
  createdAt: Timestamp;
  enableAssociatedFoodsEvents: boolean;
  enableSearchEvents: boolean;
  surveyId: Int8;
  updatedAt: Timestamp;
}

export interface Tasks {
  active: Generated<boolean>;
  createdAt: Timestamp;
  cron: Generated<string>;
  description: string | null;
  id: Generated<Int8>;
  job: string;
  name: string;
  params: string | null;
  updatedAt: Timestamp;
}

export interface UserCustomFields {
  id: Generated<Int8>;
  name: string;
  userId: Int8;
  value: string;
}

export interface UserNotificationSchedule {
  datetime: Timestamp;
  id: Generated<Int8>;
  notificationType: string | null;
  surveyId: Int8 | null;
  userId: Int8;
}

export interface UserPasswordResets {
  createdAt: Timestamp;
  id: Generated<Int8>;
  token: string;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface UserPasswords {
  passwordHash: string;
  passwordHasher: string;
  passwordSalt: string;
  userId: Int8;
}

export interface UserPhysicalData {
  birthdate: Timestamp | null;
  heightCm: number | null;
  physicalActivityLevelId: Int8 | null;
  sex: string | null;
  userId: Int8;
  weightKg: number | null;
  weightTarget: string | null;
}

export interface Users {
  createdAt: Timestamp;
  disabledAt: Timestamp | null;
  email: string | null;
  emailNotifications: Generated<boolean>;
  id: Generated<Int8>;
  multiFactorAuthentication: Generated<boolean>;
  name: string | null;
  phone: string | null;
  simpleName: string | null;
  smsNotifications: Generated<boolean>;
  updatedAt: Timestamp;
  verifiedAt: Timestamp | null;
}

export interface UserSecurables {
  action: string;
  createdAt: Timestamp;
  fields: string | null;
  securableId: Int8;
  securableType: string;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface UserSubscriptions {
  createdAt: Timestamp;
  id: Generated<Int8>;
  subscription: string;
  type: string;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface UserSurveyAliases {
  createdAt: Timestamp;
  id: Generated<Int8>;
  surveyId: Int8;
  updatedAt: Timestamp;
  urlAuthToken: string;
  userId: Int8;
  username: string;
}

export interface UserSurveyRatings {
  comment: string | null;
  createdAt: Timestamp;
  id: Generated<Int8>;
  rating: number;
  submissionId: string | null;
  surveyId: Int8;
  type: string;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface UserSurveySessions {
  createdAt: Timestamp;
  id: string;
  sessionData: string;
  surveyId: Int8;
  updatedAt: Timestamp;
  userId: Int8;
}

export interface UxEvents {
  created: Generated<Timestamp>;
  data: Json;
  eventCategories: string[];
  eventType: string;
  id: Generated<number>;
  localTimestamp: Int8 | null;
  sessionId: string;
  userId: Int8;
}

export interface DB {
  clientErrorReports: ClientErrorReports;
  externalTestUsers: ExternalTestUsers;
  feedbackSchemes: FeedbackSchemes;
  fixedFoodRanking: FixedFoodRanking;
  genUserCounters: GenUserCounters;
  jobs: Jobs;
  languages: Languages;
  languageTranslations: LanguageTranslations;
  locales: Locales;
  mfaAuthenticators: MfaAuthenticators;
  mfaDevices: MfaDevices;
  missingFoods: MissingFoods;
  nutrientTypes: NutrientTypes;
  nutrientUnits: NutrientUnits;
  pairwiseAssociationsCoOccurrences: PairwiseAssociationsCoOccurrences;
  pairwiseAssociationsOccurrences: PairwiseAssociationsOccurrences;
  pairwiseAssociationsState: PairwiseAssociationsState;
  pairwiseAssociationsTransactionsCount: PairwiseAssociationsTransactionsCount;
  permissionRole: PermissionRole;
  permissions: Permissions;
  permissionUser: PermissionUser;
  personalAccessTokens: PersonalAccessTokens;
  popularityCounters: PopularityCounters;
  refreshTokens: RefreshTokens;
  roles: Roles;
  roleUser: RoleUser;
  sequelizeMeta: SequelizeMeta;
  shortUrls: ShortUrls;
  signinLog: SigninLog;
  surveys: Surveys;
  surveySchemePrompts: SurveySchemePrompts;
  surveySchemes: SurveySchemes;
  surveySubmissionCustomFields: SurveySubmissionCustomFields;
  surveySubmissionFields: SurveySubmissionFields;
  surveySubmissionFoodCustomFields: SurveySubmissionFoodCustomFields;
  surveySubmissionFoods: SurveySubmissionFoods;
  surveySubmissionMealCustomFields: SurveySubmissionMealCustomFields;
  surveySubmissionMeals: SurveySubmissionMeals;
  surveySubmissionMissingFoods: SurveySubmissionMissingFoods;
  surveySubmissionNutrients: SurveySubmissionNutrients;
  surveySubmissionPortionSizeFields: SurveySubmissionPortionSizeFields;
  surveySubmissions: SurveySubmissions;
  surveysUxEventsSettings: SurveysUxEventsSettings;
  tasks: Tasks;
  userCustomFields: UserCustomFields;
  userNotificationSchedule: UserNotificationSchedule;
  userPasswordResets: UserPasswordResets;
  userPasswords: UserPasswords;
  userPhysicalData: UserPhysicalData;
  users: Users;
  userSecurables: UserSecurables;
  userSubscriptions: UserSubscriptions;
  userSurveyAliases: UserSurveyAliases;
  userSurveyRatings: UserSurveyRatings;
  userSurveySessions: UserSurveySessions;
  uxEvents: UxEvents;
}
