import {
  HenryCoefficientsResponse,
  PhysicalActivityLevelsResponse,
  WeightTargetsResponse,
} from '@intake24/common/types/http';
import http from './http.service';

export default {
  fetchHenryCoefficients: async (): Promise<HenryCoefficientsResponse> => {
    const { data } = await http.get<HenryCoefficientsResponse>(`feedback/henry-coefficients`);
    return data;
  },

  fetchPhysicalActivityLevels: async (): Promise<PhysicalActivityLevelsResponse> => {
    const { data } = await http.get<PhysicalActivityLevelsResponse>(
      `feedback/physical-activity-levels`
    );
    return data;
  },

  fetchWeightTargets: async (): Promise<WeightTargetsResponse> => {
    const { data } = await http.get<WeightTargetsResponse>(`feedback/weight-targets`);
    return data;
  },
};
