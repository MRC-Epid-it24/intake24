import { FrenchAnsesLocaleBuilder } from '@intake24/cli/commands/fr-inca3/locale-builder';
import { logger as mainLogger } from '@intake24/common-backend/services/logger';

export interface FrenchLocaleOptions {
  inputPath: string;
  outputPath: string;
}

export default async (options: FrenchLocaleOptions): Promise<void> => {
  const logger = mainLogger.child({ service: 'FR locale build' });
  const localeBuilder = new FrenchAnsesLocaleBuilder(logger, options);

  await localeBuilder.buildPackage();
};
