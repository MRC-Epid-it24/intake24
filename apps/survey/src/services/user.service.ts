import type { UserPhysicalDataResponse, SurveySubmissionEntry } from '@intake24/common/types/http';
import http from './http.service';

export default {
  fetchPhysicalData: async (): Promise<UserPhysicalDataResponse> => {
    const { data } = await http.get<UserPhysicalDataResponse>(`user/physical-data`);
    return data;
  },

  savePhysicalData: async (input: any): Promise<UserPhysicalDataResponse> => {
    const { data } = await http.post<UserPhysicalDataResponse>(`user/physical-data`, input);
    return data;
  },

  submissions: async (survey: string | string[]): Promise<SurveySubmissionEntry[]> => {
    const { data } = await http.get<SurveySubmissionEntry[]>(`user/submissions`, {
      params: { survey },
    });
    return data;
  },
};
