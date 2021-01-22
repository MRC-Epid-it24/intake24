import {
  GenerateUserResponse,
  SurveyParametersResponse,
  SurveyPublicParametersResponse,
  SurveyUserInfoResponse,
} from '@common/types/http';
import http from './http.service';

export default {
  generateUser: async (surveyId: string): Promise<GenerateUserResponse> => {
    const {
      data: { userName, password },
    } = await http.post<GenerateUserResponse>(`surveys/${surveyId}/generate-user`);

    return { userName, password };
  },

  surveyInfo: async (surveyId: string): Promise<SurveyParametersResponse> => {
    const { data } = await http.get<SurveyParametersResponse>(`surveys/${surveyId}/parameters`);

    return data;
  },

  surveyPublicInfo: async (surveyId: string): Promise<SurveyPublicParametersResponse> => {
    const { data } = await http.get<SurveyPublicParametersResponse>(`surveys/${surveyId}`);

    return data;
  },

  userInfo: async (surveyId: string): Promise<SurveyUserInfoResponse> => {
    const { data } = await http.get<SurveyUserInfoResponse>(`surveys/${surveyId}/user-info`);

    return data;
  },
};
