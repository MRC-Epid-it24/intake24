import {
  CreateAsServedSetInput,
  CreateAsServedImageInput,
  UpdateAsServedSetInput,
} from '@intake24/common/types/http/admin';
import { AsServedImage, AsServedSet } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';

export interface AsServedService {
  createImage: (input: CreateAsServedImageInput) => Promise<AsServedImage>;
  destroyImage: (asServedSetId: string, id?: string) => Promise<boolean>;
  createSet: (input: CreateAsServedSetInput) => Promise<AsServedSet>;
  updateSet: (asServedSetId: string, input: UpdateAsServedSetInput) => Promise<AsServedSet>;
  destroySet: (asServedSetId: string) => Promise<void>;
}

export default ({
  portionSizeService,
  processedImageService,
  sourceImageService,
}: Pick<
  IoC,
  'portionSizeService' | 'processedImageService' | 'sourceImageService'
>): AsServedService => {
  const createImage = async (input: CreateAsServedImageInput): Promise<AsServedImage> => {
    const { id, weight } = input;

    const sourceImage = await sourceImageService.uploadSourceImage(input, 'as_served');
    const [image, thumbnailImage] = await processedImageService.createAsServedImages(
      id,
      sourceImage
    );

    return AsServedImage.create({
      asServedSetId: id,
      imageId: image.id,
      thumbnailImageId: thumbnailImage.id,
      weight,
    });
  };

  const destroyImage = async (asServedSetId: string, id?: string): Promise<boolean> => {
    const asServedImages = await AsServedImage.findAll({
      where: id ? { asServedSetId, id } : { asServedSetId },
    });

    for (const asServedImage of asServedImages) {
      await Promise.all([
        asServedImage.destroy(),
        processedImageService.destroy(asServedImage.imageId, { includeSources: true }),
        processedImageService.destroy(asServedImage.thumbnailImageId, { includeSources: true }),
      ]);
    }

    return !!asServedImages.length;
  };

  const createSet = async (input: CreateAsServedSetInput): Promise<AsServedSet> => {
    const { id, description } = input;

    const sourceImage = await sourceImageService.uploadSourceImage(input, 'as_served');
    const selectionImage = await processedImageService.createSelectionImage(
      id,
      sourceImage,
      'as_served'
    );

    return AsServedSet.create({ id, description, selectionImageId: selectionImage.id });
  };

  const updateSet = async (
    asServedSetId: string,
    input: UpdateAsServedSetInput
  ): Promise<AsServedSet> => {
    const { description, images } = input;

    const asServedSet = await portionSizeService.getAsServedSet(asServedSetId);
    if (!asServedSet || !asServedSet.asServedImages) throw new NotFoundError();

    await asServedSet.update({ description });

    for (const image of images) {
      const match = asServedSet.asServedImages.find((item) => item.id === image.id);
      if (!match) continue;

      await match.update({ weight: image.weight });
    }

    return portionSizeService.getAsServedSet(asServedSetId);
  };

  const destroySet = async (asServedSetId: string): Promise<void> => {
    const asServedSet = await AsServedSet.findByPk(asServedSetId);
    if (!asServedSet) throw new NotFoundError();

    await destroyImage(asServedSetId);
    await asServedSet.destroy();
    await processedImageService.destroy(asServedSet.selectionImageId, { includeSources: true });
  };

  return {
    createImage,
    destroyImage,
    createSet,
    updateSet,
    destroySet,
  };
};
