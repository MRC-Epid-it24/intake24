import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import * as uuid from 'uuid';
import { SourceImage } from '@/db/models/foods';
import type { IoC } from '@/ioc';

export type SourceFileInput = {
  originalname: string;
  path: string;
};

export type UploadSourceImageInput = {
  id: string;
  file: SourceFileInput;
  uploader: number | string;
};

export interface SourceImageService {
  uploadSourceImage: (input: UploadSourceImageInput) => Promise<SourceImage>;
  destroy: (sourceImageId: number | number[]) => Promise<void>;
}

export default ({ config, logger }: Pick<IoC, 'config' | 'logger'>): SourceImageService => {
  const { images: imagesPath } = config.filesystem.local;

  const uploadSourceImage = async (input: UploadSourceImageInput): Promise<SourceImage> => {
    const { id, file, uploader } = input;

    const filename = `${uuid.v4()}${path.extname(file.originalname)}`;

    const sourceDir = path.join('source', 'image_maps', id);
    const sourceThumbDir = path.join('source', 'thumbnails', 'image_maps', id);

    const sourcePath = path.join(sourceDir, filename);
    const sourceThumbPath = path.join(sourceThumbDir, filename);

    for (const dir of [sourceDir, sourceThumbDir]) {
      await fs.ensureDir(path.join(imagesPath, dir));
    }

    await fs.copy(file.path, path.join(imagesPath, sourcePath));

    await sharp(path.join(imagesPath, sourcePath))
      .resize(768, 432)
      .jpeg({ mozjpeg: true })
      .toFile(path.join(imagesPath, sourceThumbPath));

    return SourceImage.create({
      path: sourcePath,
      uploader,
      uploadedAt: new Date(),
      thumbnailPath: sourceThumbPath,
    });
  };

  const destroy = async (sourceImageId: number | number[]): Promise<void> => {
    const sourceImages = await SourceImage.findAll({ where: { sourceImageId } });

    for (const sourceImage of sourceImages) {
      await sourceImage.destroy();

      try {
        await fs.unlink(path.join(imagesPath, sourceImage.path));
        await fs.unlink(path.join(imagesPath, sourceImage.thumbnailPath));
      } catch (err) {
        logger.error(`source-image.service|destroy: ${err.message}`);
      }
    }
  };

  return {
    uploadSourceImage,
    destroy,
  };
};
