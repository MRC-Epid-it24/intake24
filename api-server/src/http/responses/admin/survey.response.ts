import { Survey } from '@/db/models/system';
import { SurveyResponse } from '@common/types/api/admin/surveys';

export default (survey: Survey): SurveyResponse => {
  return {
    ...survey.get(),
    startDate: survey.startDate.toISOString().split('T')[0],
    endDate: survey.endDate.toISOString().split('T')[0],
  } as SurveyResponse;
};
