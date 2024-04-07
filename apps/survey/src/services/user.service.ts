import type { SurveySubmissionEntry, UserPhysicalDataResponse } from '@intake24/common/types/http';
import type { UserPhysicalData } from '@intake24/ui/feedback';

import http from './http.service';

export default {
  fetchPhysicalData: async (): Promise<UserPhysicalData> => {
    const { data } = await http.get<UserPhysicalDataResponse>(`user/physical-data`);

    return (
      data ?? {
        birthdate: null,
        sex: null,
        weightKg: null,
        heightCm: null,
        physicalActivityLevelId: null,
        weightTarget: null,
      }
    );
  },

  savePhysicalData: async (
    survey: string,
    input: UserPhysicalData,
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
