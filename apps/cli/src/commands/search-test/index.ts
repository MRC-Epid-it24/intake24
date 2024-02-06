import { ApiClientV4, getApiClientV4EnvOptions } from '@intake24/api-client-v4';
import { logger as mainLogger } from '@intake24/common-backend';

export default async (): Promise<void> => {
  const logger = mainLogger.child({ service: 'Search test' });

  const apiClient = new ApiClientV4(logger, getApiClientV4EnvOptions());

  const result = await apiClient.baseClient.get('/api/foods/UK_V3_2023?description=milk');
  console.log(result);
};
