import fs from 'fs-extra';
import path from 'path';
import { Op } from 'sequelize';
import sharp from 'sharp';
import * as uuid from 'uuid';
import {
  GuideImage,
  GuideImageObject,
  ImageMap,
  ImageMapObject,
  ProcessedImage,
  SourceImage,
} from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { UpdateImageMapInput } from '@common/types/http/admin';
import { ProcessedImagePurposes } from '@common/types/models';

export type SourceFileInput = {
  path: string;
  extension: string;
};

export type CreateImageMapInput = {
  id: string;
  description: string;
  file: Express.Multer.File;
  uploader: number | string;
};

export interface ImageMapService {
  create: (input: CreateImageMapInput) => Promise<ImageMap>;
  update: (imageMapId: string, input: UpdateImageMapInput) => Promise<ImageMap>;
  destroy: (imageMapId: string) => Promise<void>;
}

export default ({
  config,
  portionSizeService,
}: Pick<IoC, 'config' | 'portionSizeService'>): ImageMapService => {
  const { images: imagesPath } = config.filesystem.local;

  // TODO: extract source images logic to dedicated service
  const uploadSourceImage = async (input: CreateImageMapInput): Promise<SourceImage> => {
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

  const create = async (input: CreateImageMapInput): Promise<ImageMap> => {
    const { id, description, file } = input;

    const sourceImage = await uploadSourceImage(input);

    const filename = `${uuid.v4()}${path.extname(file.originalname)}`;
    const dir = path.join('image_maps', id);
    const fullPath = path.join(dir, filename);

    await fs.ensureDir(path.join(imagesPath, dir));

    // Do the source file processing
    console.log(sourceImage.id);
    await fs.copy(file.path, path.join(imagesPath, fullPath));

    const baseImage = await ProcessedImage.create({
      path: fullPath,
      sourceId: sourceImage.id,
      purpose: ProcessedImagePurposes.ImageMapBaseImage,
    });

    return ImageMap.create({ id, description, baseImageId: baseImage.id });
  };

  const update = async (imageMapId: string, input: UpdateImageMapInput): Promise<ImageMap> => {
    const { description, objects } = input;

    const image = await portionSizeService.getImageMap(imageMapId);
    if (!image || !image.objects) throw new NotFoundError();

    const guideImages = await GuideImage.findAll({ where: { imageMapId } });
    const guideImageIds = guideImages.map(({ id }) => id);

    await image.update({ description });

    const objectIds = objects.map((object) => object.id);
    await ImageMapObject.destroy({ where: { imageMapId, id: { [Op.notIn]: objectIds } } });

    for (const object of objects) {
      const match = image.objects.find((imageObject) => imageObject.id === object.id);

      if (!match) {
        await ImageMapObject.create({
          id: object.id,
          imageMapId,
          description: object.description,
          navigationIndex: object.id,
          outlineCoordinates: object.outlineCoordinates,
        });

        if (guideImageIds.length) {
          await GuideImageObject.bulkCreate(
            guideImageIds.map((guideImageId) => ({
              guideImageId,
              weight: 0,
              imageMapObjectId: object.id,
            }))
          );
        }

        continue;
      }

      await match.update({
        description: object.description,
        navigationIndex: object.id,
        outlineCoordinates: object.outlineCoordinates,
      });
    }

    return image;
  };

  const destroy = async (imageMapId: string): Promise<void> => {
    const image = await ImageMap.findByPk(imageMapId);
    if (!image) throw new NotFoundError();

    // await image.destroy();
  };

  return {
    create,
    update,
    destroy,
  };
};
