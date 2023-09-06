import type { SurveyState } from '@intake24/common/types';
import type {
  CreateUserResponse,
  GenerateUserResponse,
  PublicSurveyEntry,
  SurveyEntryResponse,
  SurveyRequestHelpInput,
  SurveyUserInfoResponse,
  SurveyUserSessionResponse,
} from '@intake24/common/types/http';

import http from './http.service';

export type GenerateUserPayload = {
  captcha: string | null;
};

export default {
  createUser: async (surveyId: string, token: string): Promise<CreateUserResponse> => {
    const { data } = await http.post<CreateUserResponse>(`surveys/${surveyId}/create-user`, {
      token,
    });

    return data;
  },

  generateUser: async (
    surveyId: string,
    payload: GenerateUserPayload
  ): Promise<GenerateUserResponse> => {
    const { data } = await http.post<GenerateUserResponse>(
      `surveys/${surveyId}/generate-user`,
      payload
    );

    return data;
  },

  surveyPublicList: async (): Promise<PublicSurveyEntry[]> => {
    const { data } = await http.get<PublicSurveyEntry[]>(`surveys`);

    return data;
  },

  surveyPublicInfo: async (surveyId: string): Promise<PublicSurveyEntry> => {
    const { data } = await http.get<PublicSurveyEntry>(`surveys/${surveyId}`);

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

  getUserSession: async (surveyId: string): Promise<SurveyUserSessionResponse | null> => {
    try {
      const { data } = await http.get<SurveyUserSessionResponse>(`surveys/${surveyId}/session`);
      return data;
    } catch (err) {
      return null;
    }
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

  clearUserSession: async (surveyId: string): Promise<void> =>
    http.delete(`surveys/${surveyId}/session`),

  submit: async (surveyId: string, submission: SurveyState): Promise<SurveyUserInfoResponse> => {
    const tzOffset = new Date().getTimezoneOffset();

    const { data } = await http.post<SurveyUserInfoResponse>(
      `surveys/${surveyId}/submission`,
      { submission },
      { params: { tzOffset } }
    );

    return data;
  },

  requestHelp: async (surveyId: string, payload: SurveyRequestHelpInput): Promise<void> =>
    http.post(`surveys/${surveyId}/request-help`, payload),
};
