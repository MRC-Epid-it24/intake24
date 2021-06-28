import { GuideImage, GuideImageObject, ImageMap, ImageMapObject } from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { CreateGuideImageInput, UpdateGuideImageInput } from '@common/types/http/admin';

export interface GuideImageService {
  create: (input: CreateGuideImageInput) => Promise<GuideImage>;
  update: (guideImageId: string, input: UpdateGuideImageInput) => Promise<GuideImage>;
  destroy: (guideImageId: string) => Promise<void>;
}

export default ({
  portionSizeService,
  processedImageService,
}: Pick<IoC, 'portionSizeService' | 'processedImageService'>): GuideImageService => {
  const create = async (input: CreateGuideImageInput): Promise<GuideImage> => {
    const { id, description, imageMapId } = input;

    const imageMap = await ImageMap.findByPk(imageMapId, { include: ['baseImage'] });
    if (!imageMap || !imageMap.baseImage) throw new NotFoundError();

    const selectionImage = await processedImageService.createSelectionImage(
      id,
      imageMap.baseImage.sourceId,
      'guide'
    );

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
    if (!guideImage.objects) throw new NotFoundError();

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

    return portionSizeService.getGuideImage(guideImageId);
  };

  const destroy = async (guideImageId: string): Promise<void> => {
    const guideImage = await GuideImage.findByPk(guideImageId);
    if (!guideImage) throw new NotFoundError();

    await guideImage.destroy();
    await processedImageService.destroy(guideImage.selectionImageId);
  };

  return {
    create,
    update,
    destroy,
  };
};
