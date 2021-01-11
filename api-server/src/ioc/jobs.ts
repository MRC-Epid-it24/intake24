import { asClass, AwilixContainer } from 'awilix';
import PurgeRefreshTokens from '@/jobs/purge-refresh-tokens';
import SendPasswordReset from '@/jobs/send-password-reset';
import SurveyDataExport from '@/jobs/survey-data-export';
import SurveyExportRespondentAuthUrls from '@/jobs/survey-export-respondent-auth-urls';
import SurveyImportRespondents from '@/jobs/survey-import-respondents';

export default (container: AwilixContainer): void => {
  container.register({
    PurgeRefreshTokens: asClass(PurgeRefreshTokens),
    SendPasswordReset: asClass(SendPasswordReset),
    SurveyDataExport: asClass(SurveyDataExport),
    SurveyExportRespondentAuthUrls: asClass(SurveyExportRespondentAuthUrls),
    SurveyImportRespondents: asClass(SurveyImportRespondents),
  });
};
