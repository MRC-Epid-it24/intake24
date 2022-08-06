import type { IoC } from '@intake24/api/ioc';
import type { CreateImageMapInput, UpdateImageMapInput } from '@intake24/common/types/http/admin';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { GuideImage, GuideImageObject, ImageMap, ImageMapObject, Op } from '@intake24/db';

const imageMapService = ({
  portionSizeService,
  processedImageService,
  sourceImageService,
}: Pick<IoC, 'portionSizeService' | 'processedImageService' | 'sourceImageService'>) => {
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
    const imageMap = await ImageMap.findByPk(imageMapId, { include: [{ model: GuideImage }] });
    if (!imageMap || !imageMap.guideImages) throw new NotFoundError();

    if (imageMap.guideImages.length)
      throw new ForbiddenError(
        'Image map cannot be deleted. There are guide images using this image map.'
      );

    await imageMap.destroy();
    await processedImageService.destroy(imageMap.baseImageId, { includeSources: true });
  };

  return {
    create,
    update,
    destroy,
  };
};

export default imageMapService;

export type ImageMapService = ReturnType<typeof imageMapService>;
