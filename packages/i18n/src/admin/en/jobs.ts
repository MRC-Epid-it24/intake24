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
    CleanStorageFiles: 'Clean storage files',
    PurgeRefreshTokens: 'Purge expired refresh tokens',
    NutrientTableImportMapping: 'Nutrient tables - import NDB mapping',
    NutrientTableImportData: 'Nutrient tables - import NDB data',
    SendPasswordReset: 'Send password reset',
    SurveyDataExport: 'Surveys - data export',
    SurveyExportRespondentAuthUrls: 'Surveys - export respondent authentication URLs ',
    SurveyImportRespondents: 'Surveys - import respondents',
    SurveySubmissionNotification: 'Surveys - submission notification',
  },
};

export default jobs;
