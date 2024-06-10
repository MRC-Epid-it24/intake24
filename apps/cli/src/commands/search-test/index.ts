import fs from 'node:fs';
import path from 'node:path';

import { ApiClientV4, getApiClientV4EnvOptions } from '@intake24/api-client-v4';
import { logger as mainLogger } from '@intake24/common-backend';

// const appendToCSV = (data: any, filePath: string): void => {

//   let csvData = '';

//   if (data && data.foods && Array.isArray(data.foods)) {
//     // Map each food item to a string and then join with a delimiter
//     csvData = data.foods.map((item: { code: string, name: string }) => `${item.code},${item.name}`).join(';') + '\n';
//   } else {
//     // Fallback for any other data format
//     csvData = JSON.stringify(data) + '\n';
//   }

//   // const csvData = `${data}\n`; // Format your data as needed for CSV
//   fs.appendFileSync(filePath, csvData, 'utf8');
// };

function processJSONLFile(data: any, filePath: string): void {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '');
  }
  const arrayAsJsonString = JSON.stringify(data.foods);
  fs.appendFileSync(filePath, `${arrayAsJsonString}\n`, 'utf-8');
}

export type SearchTestArgs = { term?: string };

export default async (cmd: SearchTestArgs): Promise<void> => {
  const logger = mainLogger.child({ service: 'Search test' });

  const apiClient = new ApiClientV4(logger, getApiClientV4EnvOptions());

  try {
    const searchTerm = cmd.term;

    const result = await apiClient.baseClient.get(
      `/api/foods/UK_V3_2023?description=${searchTerm}`,
    );
    console.log(result);

    // console.log("reached here")
    // const csvFilePath = path.join('../../../it24-ai/', 'orig-search-result.csv');
    // console.log(csvFilePath);

    const jsonlFilePath = path.join('../../../it24-ai/', 'orig-search-result.jsonl');
    // console.log(jsonlFilePath);
    processJSONLFile(result, jsonlFilePath);
  }
  catch (error) {
    logger.error('Error occurred:', error);
  }
};
