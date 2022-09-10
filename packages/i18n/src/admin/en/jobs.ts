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
    LanguageSyncTranslations: {
      _: 'Language - Synchronize translations',
    },
    LocaleCopyPairwiseAssociations: {
      _: 'Locale - Copy pairwise associations',
      sourceLocaleId: 'Source Locale ID',
      targetLocaleId: 'Target Locale ID',
    },
    NutrientTableImportMapping: {
      _: 'Nutrient table - import NDB mapping',
    },
    NutrientTableImportData: {
      _: 'Nutrient table - import NDB data',
    },
    SendPasswordReset: {
      _: 'Send password reset',
    },
    SurveyRespondentFeedback: {
      _: 'Survey - send respondent feedback',
    },
    SurveyDataExport: {
      _: 'Survey - data export',
    },
    SurveyExportRespondentAuthUrls: {
      _: 'Survey - export respondent authentication URLs ',
    },
    SurveyImportRespondents: {
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
