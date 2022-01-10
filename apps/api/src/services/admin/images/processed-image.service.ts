import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import * as uuid from 'uuid';
import { ProcessedImagePurposes } from '@intake24/common/types/models';
import { ProcessedImage, SourceImage } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import { NotFoundError } from '@intake24/api/http/errors';

export type SelectionImageType = 'guide' | 'as_served';

export type DestroyOptions = { includeSources?: boolean };

export interface ProcessedImageService {
  createAsServedImages: (
    id: string,
    sourceImage: SourceImage | string
  ) => Promise<[ProcessedImage, ProcessedImage]>;
  createImageMapBaseImage: (
    id: string,
    sourceImage: SourceImage | string
  ) => Promise<ProcessedImage>;
  createSelectionImage: (
    id: string,
    sourceImage: SourceImage | string,
    type: SelectionImageType
  ) => Promise<ProcessedImage>;
  destroy: (imageId: string, options?: DestroyOptions) => Promise<void>;
}

export default ({
  fsConfig,
  logger: globalLogger,
  sourceImageService,
}: Pick<IoC, 'fsConfig' | 'logger' | 'sourceImageService'>): ProcessedImageService => {
  const { images: imagesPath } = fsConfig.local;
  const logger = globalLogger.child({ service: 'ProcessedImageService' });

  const resolveSourceImage = async (sourceImageId: string): Promise<SourceImage> => {
    const sourceImage = await SourceImage.findByPk(sourceImageId);
    if (!sourceImage) {
      logger.warn(
        `resolveSourceImage: Source image (${sourceImageId}) for selection image not found.`
      );
      throw new NotFoundError();
    }

    try {
      await fs.access(path.join(imagesPath, sourceImage.path), fs.constants.F_OK);
    } catch (err: any) {
      logger.error(`resolveSourceImage: ${err.message}`);
      throw new NotFoundError();
    }

    return sourceImage;
  };

  const createAsServedImages = async (
    id: string,
    sourceImage: SourceImage | string
  ): Promise<[ProcessedImage, ProcessedImage]> => {
    const image =
      typeof sourceImage === 'string' ? await resolveSourceImage(sourceImage) : sourceImage;

    const fileName = `${uuid.v4()}${path.extname(image.path)}`;
    const fileDir = path.posix.join('as_served', id);
    const fullPath = path.posix.join(fileDir, fileName);

    const thumbFileName = `${uuid.v4()}${path.extname(image.path)}`;
    const thumbFileDir = path.posix.join('as_served', id, 'thumbnails');
    const thumbFullPath = path.posix.join(fileDir, thumbFileName);

    await Promise.all([
      fs.ensureDir(path.join(imagesPath, fileDir)),
      fs.ensureDir(path.join(imagesPath, thumbFileDir)),
    ]);

    await Promise.all([
      sharp(path.join(imagesPath, image.path))
        .resize(654)
        .jpeg({ mozjpeg: true })
        .toFile(path.join(imagesPath, fullPath)),
      sharp(path.join(imagesPath, image.path))
        .resize(80)
        .jpeg({ mozjpeg: true })
        .toFile(path.join(imagesPath, thumbFullPath)),
    ]);

    return Promise.all([
      ProcessedImage.create({
        path: fullPath,
        sourceId: image.id,
        purpose: ProcessedImagePurposes.AsServedMainImage,
      }),
      ProcessedImage.create({
        path: thumbFullPath,
        sourceId: image.id,
        purpose: ProcessedImagePurposes.AsServedThumbnail,
      }),
    ]);
  };

  const createImageMapBaseImage = async (
    id: string,
    sourceImage: SourceImage | string
  ): Promise<ProcessedImage> => {
    const image =
      typeof sourceImage === 'string' ? await resolveSourceImage(sourceImage) : sourceImage;

    const fileName = `${uuid.v4()}${path.extname(image.path)}`;
    const fileDir = path.posix.join('image_maps', id);
    const fullPath = path.posix.join(fileDir, fileName);

    await fs.ensureDir(path.join(imagesPath, fileDir));

    await sharp(path.join(imagesPath, image.path))
      .resize(1200)
      .jpeg({ mozjpeg: true })
      .toFile(path.join(imagesPath, fullPath));

    return ProcessedImage.create({
      path: fullPath,
      sourceId: image.id,
      purpose: ProcessedImagePurposes.ImageMapBaseImage,
    });
  };

  const createSelectionImage = async (
    id: string,
    sourceImage: SourceImage | string,
    type: SelectionImageType
  ): Promise<ProcessedImage> => {
    const image =
      typeof sourceImage === 'string' ? await resolveSourceImage(sourceImage) : sourceImage;

    const fileName = `${uuid.v4()}${path.extname(image.path)}`;
    const fileDir = path.posix.join(type, id, 'selection');
    const filePath = path.posix.join(fileDir, fileName);

    await fs.ensureDir(path.join(imagesPath, fileDir));

    await sharp(path.join(imagesPath, image.path))
      .resize(300, 200)
      .jpeg({ mozjpeg: true })
      .toFile(path.join(imagesPath, filePath));

    return ProcessedImage.create({
      path: filePath,
      sourceId: image.id,
      purpose: ProcessedImagePurposes.SelectionImage,
    });
  };

  const destroy = async (imageId: string, options: DestroyOptions = {}): Promise<void> => {
    const processedImage = await ProcessedImage.findByPk(imageId);
    if (!processedImage) {
      logger.warn(`destroy: processed image not found. (ID: ${imageId})`);
      return;
    }

    await processedImage.destroy();

    try {
      await fs.unlink(path.join(imagesPath, processedImage.path));
    } catch (err: any) {
      logger.warn(`destroy: ${err.message}`);
    }

    const { includeSources } = options;
    if (includeSources) await sourceImageService.destroy(processedImage.sourceId);
  };

  return {
    createAsServedImages,
    createImageMapBaseImage,
    createSelectionImage,
    destroy,
  };
};
