import type { SiteUrls } from '@intake24/api/config';
import { getFrontEndUrl } from '@intake24/api/util/strings';

const surveyUrlService = (
  urls: Pick<SiteUrls, 'base' | 'survey'>,
  surveySlug: string,
  authUrlDomainOverride?: string | null
) => {
  const { base, survey } = urls;

  const getBaseUrl = () => getFrontEndUrl(base, survey, authUrlDomainOverride);

  const getSurveyUrl = (authToken: string) => `${getBaseUrl()}/${surveySlug}?token=${authToken}`;

  const getFeedbackUrl = (authToken: string) =>
    `${getBaseUrl()}/${surveySlug}/feedback?token=${authToken}`;

  return {
    getBaseUrl,
    getSurveyUrl,
    getFeedbackUrl,
  };
};

export default surveyUrlService;

export type SurveyUrlService = ReturnType<typeof surveyUrlService>;