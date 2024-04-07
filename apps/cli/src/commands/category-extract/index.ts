import type { CsvWriter } from 'csv-writer/src/lib/csv-writer';
import { createArrayCsvWriter } from 'csv-writer';

import type { CategoryHeader } from '@intake24/common/types/http';
import { ApiClientV4, getApiClientV4EnvOptions } from '@intake24/api-client-v4';
import { logger as mainLogger } from '@intake24/common-backend';

interface ExtractCategoriesOptions {
  outputPath: string;
}

function createRow(level: number, header: CategoryHeader): string[] {
  const row = ['', '', '', '', header.code];
  row[level] = header.name;
  return row;
}

class CategoryExtract {
  private readonly localeId: string;
  private readonly writer: CsvWriter<any[]>;
  private readonly apiClient: ApiClientV4;

  constructor(localeId: string, outputPath: string, apiClient: ApiClientV4) {
    this.localeId = localeId;
    this.apiClient = apiClient;
    this.writer = createArrayCsvWriter({
      path: outputPath,
      encoding: 'utf-8',
      header: ['Main category', 'Subcategory 1', 'Subcategory 2', 'Subcategory 3', 'Category code'],
    });
  }

  public async processCategory(level: number, header: CategoryHeader) {
    if (level > 3)
      throw new Error(`Did not expect nesting deeper than 3: ${header.code} (${header.name})`);

    await this.writer.writeRecords([createRow(level, header)]);

    const contents = await this.apiClient.categories.getCategoryContents(
      header.code,
      this.localeId,
    );

    for (const subheader of contents.subcategories)
      await this.processCategory(level + 1, subheader);
  }
}

export default async (localeId: string, options: ExtractCategoriesOptions): Promise<void> => {
  const logger = mainLogger.child({ service: 'Category extract' });

  const apiClient = new ApiClientV4(logger, getApiClientV4EnvOptions());

  const categories = await apiClient.categories.getRootCategories(localeId);

  const extract = new CategoryExtract(localeId, options.outputPath, apiClient);

  for (const header of categories.subcategories)
    await extract.processCategory(0, header);
};
