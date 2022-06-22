import type { Survey } from '@intake24/db';
import type { PublicSurveyEntry } from '@intake24/common/types/http';

export const publicSurveyEntryResponse = (survey: Survey): PublicSurveyEntry => {
  const { id, slug, name, localeId, originatingUrl, supportEmail, genUserKey, allowGenUsers } =
    survey;

  return {
    id,
    slug,
    name,
    localeId,
    originatingUrl,
    supportEmail,
    openAccess: allowGenUsers && !genUserKey,
  };
};
