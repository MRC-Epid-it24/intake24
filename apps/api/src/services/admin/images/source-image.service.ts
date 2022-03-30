import { randomUUID } from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import sharp from 'sharp';
import { UploadSourceImageInput, SourceImageType } from '@intake24/common/types/http/admin';
import { SourceImage } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';

const sourceImageService = ({
  fsConfig,
  logger: globalLogger,
}: Pick<IoC, 'fsConfig' | 'logger'>) => {
  const { images: imagesPath } = fsConfig.local;
  const logger = globalLogger.child({ service: 'SourceImageService' });

  const uploadSourceImage = async (
    input: UploadSourceImageInput,
    type: SourceImageType
  ): Promise<SourceImage> => {
    const { id, file, uploader } = input;

    const filename = `${randomUUID()}${path.extname(file.originalname)}`;

    const sourceDir = path.posix.join('source', type, id);
    const sourceThumbDir = path.posix.join('source', 'thumbnails', type, id);

    const sourcePath = path.posix.join(sourceDir, filename);
    const sourceThumbPath = path.posix.join(sourceThumbDir, filename);

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

  const destroy = async (sourceImageId: string | string[]): Promise<void> => {
    const sourceImages = await SourceImage.findAll({ where: { id: sourceImageId } });

    for (const sourceImage of sourceImages) {
      await sourceImage.destroy();

      try {
        await fs.unlink(path.join(imagesPath, sourceImage.path));
        await fs.unlink(path.join(imagesPath, sourceImage.thumbnailPath));
      } catch (err) {
        if (err instanceof Error) {
          const { message, name, stack } = err;
          logger.error(stack ?? `${name}: ${message}`);
          return;
        }

        logger.error(err);
      }
    }
  };

  return {
    uploadSourceImage,
    destroy,
  };
};

export default sourceImageService;

export type SourceImageService = ReturnType<typeof sourceImageService>;
