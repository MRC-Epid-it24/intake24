import { AsServedImage, AsServedSet } from '@/db/models/foods';
import { NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import {
  CreateAsServedSetInput,
  CreateAsServedImageInput,
  UpdateAsServedSetInput,
} from '@common/types/http/admin';

export interface AsServedService {
  createSet: (input: CreateAsServedSetInput) => Promise<AsServedSet>;
  updateSet: (asServedSetId: string, input: UpdateAsServedSetInput) => Promise<AsServedSet>;
  destroySet: (asServedSetId: string) => Promise<void>;
  createImage: (input: CreateAsServedImageInput) => Promise<AsServedImage>;
  destroyImage: (asServedSetId: string, id: number | string) => Promise<void>;
}

export default ({
  portionSizeService,
  processedImageService,
  sourceImageService,
}: Pick<
  IoC,
  'portionSizeService' | 'processedImageService' | 'sourceImageService'
>): AsServedService => {
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

    await asServedSet.destroy();
    await processedImageService.destroy(asServedSet.selectionImageId, { includeSources: true });

    // TODO: destroy AsServedImage records + images
  };

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

  const destroyImage = async (asServedSetId: string, id: number | string): Promise<void> => {
    const asServedImage = await AsServedImage.findOne({ where: { asServedSetId, id } });
    if (!asServedImage) throw new NotFoundError();

    await Promise.all([
      asServedImage.destroy(),
      processedImageService.destroy(asServedImage.imageId, { includeSources: true }),
      processedImageService.destroy(asServedImage.thumbnailImageId, { includeSources: true }),
    ]);

    // TODO: destroy AsServedImage records + images
  };

  return {
    createSet,
    updateSet,
    destroySet,
    createImage,
    destroyImage,
  };
};
