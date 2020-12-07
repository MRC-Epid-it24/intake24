import { asClass, AwilixContainer } from 'awilix';
import PurgeRefreshTokens from '@/jobs/purge-refresh-tokens';
import SendPasswordReset from '@/jobs/send-password-reset';
import ExportSurveyRespondentAuthUrls from '@/jobs/export-survey-respondent-auth-urls';
import ImportSurveyRespondents from '@/jobs/import-survey-respondents';

export default (container: AwilixContainer): void => {
  container.register({
    PurgeRefreshTokens: asClass(PurgeRefreshTokens),
    SendPasswordReset: asClass(SendPasswordReset),
    ExportSurveyRespondentAuthUrls: asClass(ExportSurveyRespondentAuthUrls),
    ImportSurveyRespondents: asClass(ImportSurveyRespondents),
  });
};
