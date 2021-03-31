/* eslint-disable import/prefer-default-export */
import { Survey } from '@/db/models/system';
import { SurveyEntry, SurveyListEntry } from '@common/types/http/admin';

export const surveyListResponse = (survey: Survey): SurveyListEntry => {
  const { id, name, localeId, schemeId, state } = survey;
  return { id, name, localeId, schemeId, state };
};

export const surveyResponse = (survey: Survey): SurveyEntry => {
  return {
    ...survey.get(),
    startDate: survey.startDate.toISOString().split('T')[0],
    endDate: survey.endDate.toISOString().split('T')[0],
  };
};
