/* eslint-disable import/prefer-default-export */
import { Survey } from '@/db/models/system';
import { SurveyEntry } from '@common/types/http';

export const surveyResponse = (survey: Survey): SurveyEntry => {
  return {
    ...survey.get(),
    startDate: survey.startDate.toISOString().split('T')[0],
    endDate: survey.endDate.toISOString().split('T')[0],
  };
};
