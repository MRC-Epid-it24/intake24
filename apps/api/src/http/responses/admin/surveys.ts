import type { SurveyEntry, SurveyListEntry } from '@intake24/common/types/http/admin';
import { Survey } from '@intake24/db';

export const surveyListResponse = (survey: Survey): SurveyListEntry => {
  const { id, name, localeId, surveySchemeId, state } = survey;
  return { id, name, localeId, surveySchemeId, state };
};

export const surveyResponse = (survey: Survey): SurveyEntry => {
  return {
    ...survey.get(),
    startDate: survey.startDate.toISOString().split('T')[0],
    endDate: survey.endDate.toISOString().split('T')[0],
  };
};
