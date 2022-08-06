import type { SurveySubmissionEntry, UserPhysicalDataResponse } from '@intake24/common/types/http';

import http from './http.service';

export type UserPhysicalDataInput = Omit<NonNullable<UserPhysicalDataResponse>, 'userId'>;

export default {
  fetchPhysicalData: async (): Promise<UserPhysicalDataResponse> => {
    const { data } = await http.get<UserPhysicalDataResponse>(`user/physical-data`);
    return data;
  },

  savePhysicalData: async (
    survey: string,
    input: UserPhysicalDataInput
  ): Promise<UserPhysicalDataResponse> => {
    const { data } = await http.post<UserPhysicalDataResponse>(`user/physical-data`, input, {
      params: { survey },
    });
    return data;
  },

  submissions: async (survey: string | string[]): Promise<SurveySubmissionEntry[]> => {
    const { data } = await http.get<SurveySubmissionEntry[]>(`user/submissions`, {
      params: { survey },
    });
    return data;
  },
};
