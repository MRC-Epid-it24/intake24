import { ApiClientV4, getApiClientV4EnvOptions } from '@intake24/api-client-v4';
import { ConvertorToPackage } from '@intake24/cli/commands/packager/convert-to-package';
import { logger as mainLogger } from '@intake24/common-backend/services/logger';

export interface PackageImportOptions {
  type: 'package' | 'csv';
}

export default async (
  version: string,
  inputFilePath: string,
  outputFilePath: string,
  options: PackageImportOptions,
): Promise<void> => {
  const logger = mainLogger.child({ service: 'toPackageConvertor' });
  const apiClient = new ApiClientV4(logger, getApiClientV4EnvOptions());

  const convertor = new ConvertorToPackage(apiClient, inputFilePath, outputFilePath, logger, {
    type: options.type ?? 'csv',
  });

  await convertor.convert();
};
