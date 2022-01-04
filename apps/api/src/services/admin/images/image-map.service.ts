import { Op, GuideImage, GuideImageObject, ImageMap, ImageMapObject } from '@intake24/db';
import { CreateImageMapInput, UpdateImageMapInput } from '@common/types/http/admin';
import { NotFoundError } from '@api/http/errors';
import type { IoC } from '@api/ioc';

export interface ImageMapService {
  create: (input: CreateImageMapInput) => Promise<ImageMap>;
  update: (imageMapId: string, input: UpdateImageMapInput) => Promise<ImageMap>;
  destroy: (imageMapId: string) => Promise<void>;
}

export default ({
  portionSizeService,
  processedImageService,
  sourceImageService,
}: Pick<
  IoC,
  'portionSizeService' | 'processedImageService' | 'sourceImageService'
>): ImageMapService => {
  const create = async (input: CreateImageMapInput): Promise<ImageMap> => {
    const { id, description } = input;

    const sourceImage = await sourceImageService.uploadSourceImage(input, 'image_maps');
    const baseImage = await processedImageService.createImageMapBaseImage(id, sourceImage);

    return ImageMap.create({ id, description, baseImageId: baseImage.id });
  };

  const update = async (imageMapId: string, input: UpdateImageMapInput): Promise<ImageMap> => {
    const { description, objects } = input;

    const imageMap = await portionSizeService.getImageMap(imageMapId);
    if (!imageMap.objects) throw new NotFoundError();

    const guideImages = await GuideImage.findAll({ where: { imageMapId } });
    const guideImageIds = guideImages.map(({ id }) => id);

    await imageMap.update({ description });

    const objectIds = objects.map((object) => object.id);
    await ImageMapObject.destroy({ where: { imageMapId, id: { [Op.notIn]: objectIds } } });

    for (const object of objects) {
      const match = imageMap.objects.find((imageMapObject) => imageMapObject.id === object.id);

      if (!match) {
        await ImageMapObject.create({
          id: object.id,
          imageMapId,
          description: object.description,
          navigationIndex: parseInt(object.id, 10),
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
        navigationIndex: parseInt(object.id, 10),
        outlineCoordinates: object.outlineCoordinates,
      });
    }

    return portionSizeService.getImageMap(imageMapId);
  };

  const destroy = async (imageMapId: string): Promise<void> => {
    const imageMap = await ImageMap.findByPk(imageMapId);
    if (!imageMap) throw new NotFoundError();

    await imageMap.destroy();
    await processedImageService.destroy(imageMap.baseImageId, { includeSources: true });
  };

  return {
    create,
    update,
    destroy,
  };
};
