import { SurveyState } from '@common/types';
import {
  GenerateUserResponse,
  PublicSurveyEntryResponse,
  PublicSurveyListResponse,
  SurveyEntryResponse,
  SurveyUserInfoResponse,
  SurveyUserSessionResponse,
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

  surveyPublicList: async (): Promise<PublicSurveyListResponse> => {
    const { data } = await http.get<PublicSurveyListResponse>(`surveys`);

    return data;
  },

  surveyPublicInfo: async (surveyId: string): Promise<PublicSurveyEntryResponse> => {
    const { data } = await http.get<PublicSurveyEntryResponse>(`surveys/${surveyId}`);

    return data;
  },

  surveyInfo: async (surveyId: string): Promise<SurveyEntryResponse> => {
    const { data } = await http.get<SurveyEntryResponse>(`surveys/${surveyId}/parameters`);

    return data;
  },

  userInfo: async (surveyId: string): Promise<SurveyUserInfoResponse> => {
    const tzOffset = new Date().getTimezoneOffset();

    const { data } = await http.get<SurveyUserInfoResponse>(`surveys/${surveyId}/user-info`, {
      params: { tzOffset },
    });

    return data;
  },

  getUserSession: async (surveyId: string): Promise<SurveyUserSessionResponse> => {
    const { data } = await http.get<SurveyUserSessionResponse>(`surveys/${surveyId}/session`);

    return data;
  },

  setUserSession: async (
    surveyId: string,
    sessionData: SurveyState
  ): Promise<SurveyUserSessionResponse> => {
    const { data } = await http.post<SurveyUserSessionResponse>(`surveys/${surveyId}/session`, {
      sessionData,
    });

    return data;
  },

  submit: async (surveyId: string, submission: SurveyState): Promise<void> => {
    await http.post(`surveys/${surveyId}/submissions`, { submission });
  },
};
