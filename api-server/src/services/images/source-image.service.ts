import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import * as uuid from 'uuid';
import { SourceImage } from '@/db/models/foods';
import type { IoC } from '@/ioc';
import { UploadSourceImageInput, SourceImageType } from '@common/types/http/admin';

export interface SourceImageService {
  uploadSourceImage: (input: UploadSourceImageInput, type: SourceImageType) => Promise<SourceImage>;
  destroy: (sourceImageId: number | number[]) => Promise<void>;
}

export default ({ fsConfig, logger }: Pick<IoC, 'fsConfig' | 'logger'>): SourceImageService => {
  const { images: imagesPath } = fsConfig.local;

  const uploadSourceImage = async (
    input: UploadSourceImageInput,
    type: SourceImageType
  ): Promise<SourceImage> => {
    const { id, file, uploader } = input;

    const filename = `${uuid.v4()}${path.extname(file.originalname)}`;

    const sourceDir = path.join('source', type, id);
    const sourceThumbDir = path.join('source', 'thumbnails', type, id);

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
      uploader: uploader.toString(),
      uploadedAt: new Date(),
      thumbnailPath: sourceThumbPath,
    });
  };

  const destroy = async (sourceImageId: number | number[]): Promise<void> => {
    const sourceImages = await SourceImage.findAll({ where: { id: sourceImageId } });

    for (const sourceImage of sourceImages) {
      await sourceImage.destroy();

      try {
        await fs.unlink(path.join(imagesPath, sourceImage.path));
        await fs.unlink(path.join(imagesPath, sourceImage.thumbnailPath));
      } catch (err) {
        logger.error(`SourceImageService|destroy: ${err.message}`);
      }
    }
  };

  return {
    uploadSourceImage,
    destroy,
  };
};
