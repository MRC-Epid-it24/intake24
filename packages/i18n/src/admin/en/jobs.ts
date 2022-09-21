import type { LocaleMessageObject } from 'vue-i18n';

const jobs: LocaleMessageObject = {
  _: 'Job',
  title: 'Jobs',
  read: 'Job detail',
  delete: 'Delete job',
  downloadUrl: 'Download Url',
  downloadUrlExpiresAt: 'Download Url expires at',
  progress: 'Progress',
  successful: 'Successful',
  message: 'Message',
  params: 'Job parameters',
  stackTrace: 'Error message',

  types: {
    _: 'Job types',
    CleanRedisStore: {
      _: 'Clean redis store',
      stores: {
        _: 'Redis store',
        cache: 'Cache',
        session: 'Session',
      },
    },
    CleanStorageFiles: {
      _: 'Clean storage files',
    },
    PurgeRefreshTokens: {
      _: 'Purge expired refresh tokens',
    },
    LanguageTranslationsSync: {
      _: 'Language - Synchronize translations',
    },
    LocaleFoodNutrientMapping: {
      _: 'Locale - Export food nutrient mapping',
      localeId: 'Locale ID',
    },
    NutrientTableIMappingImport: {
      _: 'Nutrient table - import NDB mapping',
    },
    NutrientTableDataImport: {
      _: 'Nutrient table - import NDB data',
    },
    PairwiseSearchCopyAssociations: {
      _: 'Search - Copy pairwise associations',
      sourceLocaleId: 'Source Locale ID',
      targetLocaleId: 'Target Locale ID',
    },
    PopularitySearchUpdateCounters: {
      _: 'Search - Update popularity counters',
      foodCodes: 'Food codes',
    },
    UserPasswordResetNotification: {
      _: 'Send password reset',
    },
    SurveyFeedbackNotification: {
      _: 'Survey - send respondent feedback',
    },
    SurveyDataExport: {
      _: 'Survey - data export',
    },
    SurveyAuthUrlsExport: {
      _: 'Survey - export respondent authentication URLs ',
    },
    SurveyRespondentsImport: {
      _: 'Survey - import respondents',
    },
    SurveySubmission: {
      _: 'Survey - process submission',
    },
    SurveySubmissionNotification: {
      _: 'Survey - submission notification',
    },
  },
};

export default jobs;
