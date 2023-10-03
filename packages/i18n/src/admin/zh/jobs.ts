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
    LocaleFoodRankingUpload: {
      _: 'Locale - food ranking CSV upload',
      file: 'CSV file',
    },
    LocaleFoods: {
      _: 'Locale - Export foods',
      localeId: 'Locale ID',
    },
    LocalePopularitySearchCopy: {
      _: 'Locale - Copy popularity search',
      localeId: 'Locale ID',
      sourceLocaleId: 'Source Locale ID',
    },
    NutrientTableMappingImport: {
      _: 'Nutrient table - Import NDB mapping',
      file: 'CSV file',
    },
    NutrientTableDataImport: {
      _: 'Nutrient table - Import NDB data',
      file: 'CSV file',
    },
    PopularitySearchUpdateCounters: {
      _: 'Search - Update popularity counters',
      foodCodes: 'Food codes',
    },
    SurveyAuthUrlsExport: {
      _: 'Survey - Export authentication URLs',
      surveyId: 'Survey ID',
    },
    SurveyDataExport: {
      _: 'Survey - Submission data export',
      surveyId: 'Survey ID',
    },
    SurveyFeedbackNotification: {
      _: 'Survey - Send respondent feedback',
    },
    SurveyHelpRequestNotification: {
      _: 'Survey - Help Request Notification ',
    },
    SurveyNutrientsRecalculation: {
      _: 'Survey - Nutrients recalculation',
      surveyId: 'Survey ID',
    },
    SurveyRespondentsImport: {
      _: 'Survey - Import respondents',
      file: 'CSV file',
    },
    SurveySubmission: {
      _: 'Survey - Process submission',
    },
    SurveySubmissionNotification: {
      _: 'Survey - Submission notification',
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
