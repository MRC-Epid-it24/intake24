import fs from 'fs-extra';
import path from 'path';
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
import { CreateGuideImageInput, UpdateGuideImageInput } from '@common/types/http/admin';
import { ProcessedImagePurposes } from '@common/types/models';

export interface GuideImageService {
  create: (input: CreateGuideImageInput) => Promise<GuideImage>;
  update: (guideImageId: string, input: UpdateGuideImageInput) => Promise<GuideImage>;
  destroy: (guideImageId: string) => Promise<void>;
}

export default ({
  config,
  logger,
  portionSizeService,
}: Pick<IoC, 'config' | 'logger' | 'portionSizeService'>): GuideImageService => {
  const { images: imagesPath } = config.filesystem.local;

  const createSelectionImage = async (
    guideImageId: string,
    sourceImageId: number
  ): Promise<ProcessedImage> => {
    const sourceImage = await SourceImage.findByPk(sourceImageId);
    if (!sourceImage) {
      logger.warn(
        `GuideImageService: Source image (${sourceImageId}) for selection image not found.`
      );
      throw new NotFoundError();
    }

    const fileName = `${uuid.v4()}${path.extname(sourceImage.path)}`;
    const fileDir = path.join('guide', guideImageId, 'selection');
    const filePath = path.join(fileDir, fileName);

    await fs.ensureDir(path.join(imagesPath, fileDir));

    await sharp(path.join(imagesPath, sourceImage.path))
      .resize(300, 200)
      .jpeg({ mozjpeg: true })
      .toFile(path.join(imagesPath, filePath));

    return ProcessedImage.create({
      path: filePath,
      sourceId: sourceImage.id,
      purpose: ProcessedImagePurposes.GuideImageSelectionImage,
    });
  };

  const create = async (input: CreateGuideImageInput): Promise<GuideImage> => {
    const { id, description, imageMapId } = input;

    const imageMap = await ImageMap.findByPk(imageMapId, { include: ['baseImage'] });
    if (!imageMap || !imageMap.baseImage) throw new NotFoundError();

    const selectionImage = await createSelectionImage(id, imageMap.baseImage.sourceId);

    const guideImage = await GuideImage.create({
      id,
      description,
      imageMapId,
      selectionImageId: selectionImage.id,
    });

    const imageMapObjects = await ImageMapObject.findAll({
      where: { imageMapId },
      order: [['id', 'ASC']],
    });

    const guideImageObjects = imageMapObjects.map((object) => ({
      guideImageId: guideImage.id,
      imageMapObjectId: object.id,
      weight: 0,
    }));

    await GuideImageObject.bulkCreate(guideImageObjects);

    return guideImage;
  };

  const update = async (
    guideImageId: string,
    input: UpdateGuideImageInput
  ): Promise<GuideImage> => {
    const { description, objects } = input;

    const guideImage = await portionSizeService.getGuideImage(guideImageId);
    if (!guideImage || !guideImage.objects) throw new NotFoundError();

    await guideImage.update({ description });

    for (const object of objects) {
      const { id, weight } = object;
      const match = guideImage.objects.find((guideObject) => guideObject.imageMapObjectId === id);

      if (!match) {
        await GuideImageObject.create({ guideImageId, imageMapObjectId: id, weight });
        continue;
      }

      await match.update({ weight: object.weight });
    }

    return guideImage;
  };

  const destroy = async (guideImageId: string): Promise<void> => {
    const guideImage = await GuideImage.findByPk(guideImageId, { include: ['selectionImage'] });
    if (!guideImage) throw new NotFoundError();

    await guideImage.destroy();

    const { selectionImage } = guideImage;
    if (selectionImage) {
      fs.access(path.join(imagesPath, selectionImage.path), fs.constants.F_OK, async (err) => {
        if (err) {
          logger.error(err.message);
          return;
        }

        await fs.unlink(path.join(imagesPath, selectionImage.path));
      });
      await selectionImage.destroy();
    }
  };

  return {
    create,
    update,
    destroy,
  };
};
