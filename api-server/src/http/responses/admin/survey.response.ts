import { Survey } from '@/db/models/system';
import { SurveyEntry } from '@common/types/http';

export default (survey: Survey): SurveyEntry => {
  return {
    ...survey.get(),
    startDate: survey.startDate.toISOString().split('T')[0],
    endDate: survey.endDate.toISOString().split('T')[0],
  } as SurveyEntry;
};
