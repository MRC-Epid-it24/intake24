import { logger as mainLogger } from '@intake24/common-backend/services/logger';
import { getDrinkScale } from '@intake24/svg-utils';

export interface ConvertDrinkScaleOptions {
  selection: string;
  scale: [[string, string]];
  volumeSamples: string;
  outputPath: string;
}

export default async (options: ConvertDrinkScaleOptions): Promise<void> => {
  const logger = mainLogger.child({ service: 'Convert drink scale' });

  logger.info(JSON.stringify(options.scale));

  for (const [objectId, svgPath] of options.scale) {
    logger.info(`Extracting drink scale outline from ${svgPath}`);

    const outlineCoordinates = await getDrinkScale(svgPath);

    logger.info(`Outline coordinates for object ${objectId}: ${outlineCoordinates}`);
  }
};
