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

  repeat: {
    _: 'Repeat job',
    confirm: 'Push the job to the queue',
  },

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
    FoodRankingCsvUpload: {
      _: 'Locale - food ranking CSV upload',
      file: 'CSV file',
    },
    NutrientTableIMappingImport: {
      _: 'Nutrient table - import NDB mapping',
      file: 'CSV file',
    },
    NutrientTableDataImport: {
      _: 'Nutrient table - import NDB data',
      file: 'CSV file',
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
    SurveyFeedbackNotification: {
      _: 'Survey - send respondent feedback',
    },
    SurveyDataExport: {
      _: 'Survey - data export',
    },
    SurveyAuthUrlsExport: {
      _: 'Survey - export respondent authentication URLs',
    },
    SurveyHelpRequestNotification: {
      _: 'Survey - Help Request Notification ',
    },
    SurveyRespondentsImport: {
      _: 'Survey - import respondents',
      file: 'CSV file',
    },
    SurveySubmission: {
      _: 'Survey - process submission',
    },
    SurveySubmissionNotification: {
      _: 'Survey - submission notification',
    },
    UserEmailVerificationNotification: {
      _: 'User - EmailVerificationNotification',
    },
    UserPasswordResetNotification: {
      _: 'User - Send password reset',
    },
  },
};

export default jobs;
