import { RecallState } from '@common/types';
import {
  GenerateUserResponse,
  PublicSurveyEntryResponse,
  SurveyEntryResponse,
  SurveyUserInfoResponse,
} from '@common/types/http';
import http from './http.service';

export type GenerateUserPayload = {
  reCaptchaToken: string | null;
};

export default {
  generateUser: async (
    surveyId: string,
    payload: GenerateUserPayload
  ): Promise<GenerateUserResponse> => {
    const {
      data: { userName, password },
    } = await http.post<GenerateUserResponse>(`surveys/${surveyId}/generate-user`, payload);

    return { userName, password };
  },

  surveyInfo: async (surveyId: string): Promise<SurveyEntryResponse> => {
    const { data } = await http.get<SurveyEntryResponse>(`surveys/${surveyId}/parameters`);

    return data;
  },

  surveyPublicInfo: async (surveyId: string): Promise<PublicSurveyEntryResponse> => {
    const { data } = await http.get<PublicSurveyEntryResponse>(`surveys/${surveyId}`);

    return data;
  },

  userInfo: async (surveyId: string): Promise<SurveyUserInfoResponse> => {
    const { data } = await http.get<SurveyUserInfoResponse>(`surveys/${surveyId}/user-info`);

    return data;
  },

  submit: async (surveyId: string, submission: RecallState): Promise<void> => {
    await http.post(`surveys/${surveyId}/submissions`, { submission });
  },
};
