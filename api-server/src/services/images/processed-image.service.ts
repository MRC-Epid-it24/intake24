import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import * as uuid from 'uuid';
import { ProcessedImage, SourceImage } from '@/db/models/foods';
import type { IoC } from '@/ioc';
import { NotFoundError } from '@/http/errors';
import { ProcessedImagePurposes } from '@common/types/models';

export type DestroyOptions = { includeSources?: boolean };

export interface ProcessedImageService {
  createImageMapBaseImage: (
    id: string,
    sourceImage: SourceImage | number
  ) => Promise<ProcessedImage>;
  createSelectionImage: (id: string, sourceImage: SourceImage | number) => Promise<ProcessedImage>;
  destroy: (imageId: number, options?: DestroyOptions) => Promise<void>;
}

export default ({ config, logger }: Pick<IoC, 'config' | 'logger'>): ProcessedImageService => {
  const { images: imagesPath } = config.filesystem.local;

  const resolveSourceImage = async (sourceImageId: number): Promise<SourceImage> => {
    const sourceImage = await SourceImage.findByPk(sourceImageId);
    if (!sourceImage) {
      logger.warn(
        `processed-image.service|resolveSourceImage: Source image (${sourceImageId}) for selection image not found.`
      );
      throw new NotFoundError();
    }

    try {
      await fs.access(path.join(imagesPath, sourceImage.path), fs.constants.F_OK);
    } catch (err) {
      logger.error(`processed-image.service|resolveSourceImage: ${err.message}`);
      throw new NotFoundError();
    }

    return sourceImage;
  };

  const createImageMapBaseImage = async (
    id: string,
    sourceImage: SourceImage | number
  ): Promise<ProcessedImage> => {
    const image =
      typeof sourceImage === 'number' ? await resolveSourceImage(sourceImage) : sourceImage;

    const fileName = `${uuid.v4()}${path.extname(image.path)}`;
    const fileDir = path.join('image_maps', id);
    const fullPath = path.join(fileDir, fileName);

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
    sourceImage: SourceImage | number
  ): Promise<ProcessedImage> => {
    const image =
      typeof sourceImage === 'number' ? await resolveSourceImage(sourceImage) : sourceImage;

    const fileName = `${uuid.v4()}${path.extname(image.path)}`;
    const fileDir = path.join('guide', id, 'selection');
    const filePath = path.join(fileDir, fileName);

    await fs.ensureDir(path.join(imagesPath, fileDir));

    await sharp(path.join(imagesPath, image.path))
      .resize(300, 200)
      .jpeg({ mozjpeg: true })
      .toFile(path.join(imagesPath, filePath));

    return ProcessedImage.create({
      path: filePath,
      sourceId: image.id,
      purpose: ProcessedImagePurposes.GuideImageSelectionImage,
    });
  };

  const destroy = async (imageId: number, options: DestroyOptions = {}): Promise<void> => {
    const processedImage = await ProcessedImage.findByPk(imageId);
    if (!processedImage) return;

    await processedImage.destroy();

    try {
      await fs.unlink(path.join(imagesPath, processedImage.path));
    } catch (err) {
      logger.error(`processed-image.service|destroy: ${err.message}`);
    }

    const { includeSources } = options;
    if (includeSources) {
      // delete source records
    }
  };

  return {
    createImageMapBaseImage,
    createSelectionImage,
    destroy,
  };
};
