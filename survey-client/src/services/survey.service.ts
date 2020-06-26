import { AnyDictionary } from '@common/types/common';
import { Scheme } from '@common/types/recall';
import http from './http.service';

export interface GenerateUserResponse {
  userName: string;
  password: string;
}

export interface SurveyParametersResponse {
  description: string | null;
  finalPageHtml: string | null;
  id: string;
  localeId: string;
  numberOfSurveysForFeedback: number;
  schemeId: string;
  scheme: Scheme;
  state: string;
  storeUserSessionOnServer: boolean;
  suspensionReason: string | null;
  uxEventsSettings: AnyDictionary;
}

export interface SurveyPublicParametersResponse {
  localeId: string;
  originatingURL: string | null;
  respondentLanguageId: string;
  supportEmail: string;
}

export interface SurveyUserInfoResponse {
  id: number;
  name: string | null;
  recallNumber: number;
  redirectToFeedback: boolean;
}

export default {
  generateUser: async (surveyId: string): Promise<GenerateUserResponse> => {
    const {
      data: { userName, password },
    } = await http.post<GenerateUserResponse>(`v3/surveys/${surveyId}/generate-user`);

    return { userName, password };
  },

  surveyInfo: async (surveyId: string): Promise<SurveyParametersResponse> => {
    const { data } = await http.get<SurveyParametersResponse>(`v3/surveys/${surveyId}/parameters`);

    return data;
  },

  surveyPublicInfo: async (surveyId: string): Promise<SurveyPublicParametersResponse> => {
    const { data } = await http.get<SurveyPublicParametersResponse>(`v3/surveys/${surveyId}`);

    return data;
  },

  userInfo: async (surveyId: string): Promise<SurveyUserInfoResponse> => {
    const { data } = await http.get<SurveyUserInfoResponse>(`v3/surveys/${surveyId}/user-info`);

    return data;
  },
};
