import { FrenchAlbaneLocaleBuilder } from '@intake24/cli/commands/fr-albane/locale-builder';
import { logger as mainLogger } from '@intake24/common-backend/services/logger';

export interface FrenchLocaleOptions {
  inputPath: string;
  outputPath: string;
}

export default async (options: FrenchLocaleOptions): Promise<void> => {
  const logger = mainLogger.child({ service: 'FR Albane locale build' });
  const localeBuilder = new FrenchAlbaneLocaleBuilder(logger, options);

  await localeBuilder.buildPackage();
};
