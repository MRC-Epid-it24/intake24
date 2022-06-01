import type { SiteUrls } from '../config';
import { getFrontEndUrl } from '../util/strings';

const frontEndUrlService = (
  urls: SiteUrls,
  surveySlug: string,
  authUrlDomainOverride?: string | null
) => {
  const { base, admin, survey } = urls;

  const getAdminFrontendUrl = () => getFrontEndUrl(base, admin, authUrlDomainOverride);

  const getSurveyFrontendUrl = () => getFrontEndUrl(base, survey, authUrlDomainOverride);

  const getSurveyRespondentUrl = (authToken: string) =>
    `${getFrontEndUrl(base, survey, authUrlDomainOverride)}/${surveySlug}?token=${authToken}}`;

  const getFeedbackRespondentUrl = (authToken: string) =>
    `${getFrontEndUrl(
      base,
      survey,
      authUrlDomainOverride
    )}/${surveySlug}/feedback?token=${authToken}}`;

  return {
    getAdminFrontendUrl,
    getSurveyFrontendUrl,
    getSurveyRespondentUrl,
    getFeedbackRespondentUrl,
  };
};

export default frontEndUrlService;

export type FrontEndUrlService = ReturnType<typeof frontEndUrlService>;
