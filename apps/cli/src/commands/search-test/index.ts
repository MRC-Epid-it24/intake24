import fs from 'node:fs';

import { ApiClientV4, getApiClientV4EnvOptions } from '@intake24/api-client-v4';
import { logger as mainLogger } from '@intake24/common-backend';

function processJSONLFile(data: any, filePath: string): void {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
  const arrayAsJsonString = JSON.stringify(data.foods);
  fs.appendFileSync(filePath, `${arrayAsJsonString}\n`, 'utf-8');
}

export type SearchTestArgs = { term: string; path: string };

export default async (cmd: SearchTestArgs): Promise<void> => {
  const logger = mainLogger.child({ service: 'Search test' });

  const apiClient = new ApiClientV4(logger, getApiClientV4EnvOptions());

  try {
    const searchTerm = cmd.term;
    const jsonlFilePath = cmd.path;
    const result = await apiClient.baseClient.get(`/api/surveys/demo/search?description=${searchTerm}&recipe=false&hidden=false`);
    processJSONLFile(result, jsonlFilePath);
  }
  catch (error) {
    logger.error('Error occurred:', error);
  }
};
