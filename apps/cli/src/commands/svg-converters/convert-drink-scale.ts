import { createReadStream } from 'node:fs';
import { copyFile } from 'node:fs/promises';
import path from 'node:path';

import parseCsv from 'csv-parser';
import fs from 'fs/promises';
import { groupBy, keys, maxBy } from 'lodash';

import type { PkgDrinkScaleV2 } from '@intake24/cli/commands/packager/types/drinkware';
import type {
  PkgImageMap,
  PkgImageMapObject,
} from '@intake24/cli/commands/packager/types/image-map';
import type { ImageMapData } from '@intake24/svg-utils';
import { PkgConstants } from '@intake24/cli/commands/packager/constants';
import { PackageWriter } from '@intake24/cli/commands/packager/package-writer';
import { logger as mainLogger } from '@intake24/common-backend/services/logger';
import { getDrinkScaleOutline, getImageMapData } from '@intake24/svg-utils';

type Logger = typeof mainLogger;

export interface ConvertDrinkScaleOptions {
  setId: string;
  description: string;
  selectionSvg: string;
  selectionBaseImage: string;
  scalesCsv: string;
  outputDir: string;
  overwrite: boolean;
}

interface DrinkScaleDef {
  id: string;
  description: string;
  baseImagePath: string;
  scaleOutlinePath: string;
  volumeSamples: [number, number][];
}

const drinkScaleRowHeaders = [
  'id',
  'description',
  'baseImagePath',
  'scaleOutlinePath',
  'volume',
  'fillLevel',
] as const;

type DrinkScaleDefRow = {
  [key in (typeof drinkScaleRowHeaders)[number]]: string;
};

function parseDrinkScaleCsv(path: string): Promise<DrinkScaleDef[]> {
  const rows: DrinkScaleDefRow[] = [];

  return new Promise((resolve) => {
    createReadStream(path)
      .pipe(parseCsv({ headers: drinkScaleRowHeaders, skipLines: 1 }))
      .on('data', (data) => rows.push(data))
      .on('end', () => {
        const grouped = groupBy(rows, (row) => row.id);
        const defs: DrinkScaleDef[] = Object.entries(grouped).map(([id, rows]) => ({
          id,
          description: rows[0].description,
          baseImagePath: rows[0].baseImagePath,
          scaleOutlinePath: rows[0].scaleOutlinePath,
          volumeSamples: rows.map((row) => [parseFloat(row.fillLevel), parseFloat(row.volume)]),
        }));

        resolve(defs);
      });
  });
}

function normaliseVolumeSamples(volumeSamples: [number, number][]): number[] {
  const maxFillLevel = maxBy(volumeSamples, (sample) => sample[0])![0];

  const normalised: number[] = [];

  for (const [fillLevel, volume] of volumeSamples) {
    normalised.push(fillLevel / maxFillLevel, volume);
  }

  return normalised;
}

async function copyDependencies(
  selectionImagePath: string,
  drinkScaleDefs: DrinkScaleDef[],
  defSourcePath: string,
  outputDir: string,
  setImageDir: string,
  overwrite: boolean
) {
  const selectionDestPath = path.join(
    outputDir,
    setImageDir,
    'selection',
    path.basename(selectionImagePath)
  );

  await fs.mkdir(path.dirname(selectionDestPath), { recursive: true });
  await copyFile(selectionImagePath, selectionDestPath, overwrite ? 0 : fs.constants.COPYFILE_EXCL);

  // Scale image paths are relative to the description CSV path
  const defDir = path.dirname(defSourcePath);

  for (const scaleDef of drinkScaleDefs) {
    const baseImagePath = path.join(defDir, scaleDef.baseImagePath);
    const destPath = path.join(outputDir, setImageDir, scaleDef.baseImagePath);

    await fs.mkdir(path.dirname(destPath), { recursive: true });

    await copyFile(baseImagePath, destPath, overwrite ? 0 : fs.constants.COPYFILE_EXCL);
  }
}

async function convertDrinkScale(
  logger: Logger,
  drinkScaleDef: DrinkScaleDef,
  defSourcePath: string,
  setImageDir: string
): Promise<PkgDrinkScaleV2> {
  // SVG paths are relative to the description CSV path
  const defDir = path.dirname(defSourcePath);
  const scaleSvgPath = path.join(defDir, drinkScaleDef.scaleOutlinePath);
  const pkgBaseImagePath = setImageDir + '/' + drinkScaleDef.baseImagePath;

  logger.debug(`Extracting drink scale outline from ${scaleSvgPath}`);

  const outlineCoordinates = await getDrinkScaleOutline(scaleSvgPath);
  const volumeSamples = normaliseVolumeSamples(drinkScaleDef.volumeSamples);

  return {
    version: 2,
    label: { en: drinkScaleDef.description },
    baseImagePath: pkgBaseImagePath,
    volumeSamples,
    outlineCoordinates,
  };
}

function convertSelectionImageMap(
  setId: string,
  svgData: ImageMapData,
  scaleDefs: DrinkScaleDef[],
  baseImagePath: string,
  setImageDir: string
): PkgImageMap {
  const pkgBaseImagePath = setImageDir + '/selection/' + path.basename(baseImagePath);

  const imageMapObjects: [string, PkgImageMapObject][] = svgData.objects.map((svgObj) => [
    svgObj.objectId,
    {
      description: scaleDefs.find((scale) => scale.id === svgObj.objectId)!.description,
      outlineCoordinates: svgObj.coords,
      navigationIndex: svgData.navigation.indexOf(svgObj.objectId),
    },
  ]);

  return {
    baseImagePath: pkgBaseImagePath,
    description: `Selection for drinkware set ${setId}`,
    objects: Object.fromEntries(imageMapObjects),
  };
}

export default async (options: ConvertDrinkScaleOptions): Promise<void> => {
  const logger = mainLogger.child({ service: 'Convert drink scale' });

  const packageWriter = new PackageWriter(logger, options.outputDir);

  logger.debug(`Parsing drink scale description CSV: ${options.scalesCsv}`);

  const drinkScaleDefs = await parseDrinkScaleCsv(options.scalesCsv);

  logger.debug(`Extracting drink scale selection image map from ${options.selectionSvg}`);

  const svgImageMapData = await getImageMapData(options.selectionSvg);

  const setImageDir = 'drinkware/' + options.setId;

  const pkgDrinkScales: Record<number, PkgDrinkScaleV2> = {};

  for (const def of drinkScaleDefs) {
    pkgDrinkScales[parseInt(def.id)] = await convertDrinkScale(
      logger,
      def,
      options.scalesCsv,
      setImageDir
    );
  }

  const selectionImageMap = convertSelectionImageMap(
    options.setId,
    svgImageMapData,
    drinkScaleDefs,
    options.selectionBaseImage,
    setImageDir
  );

  await copyDependencies(
    options.selectionBaseImage,
    drinkScaleDefs,
    options.scalesCsv,
    options.outputDir,
    setImageDir,
    options.overwrite
  );

  await packageWriter.appendImageMaps({
    [options.setId]: selectionImageMap,
  });

  await packageWriter.appendDrinkwareSets({
    [options.setId]: {
      description: options.description,
      selectionImageMapId: options.setId,
      scales: pkgDrinkScales,
    },
  });

  await packageWriter.writePackageInfo();
};
