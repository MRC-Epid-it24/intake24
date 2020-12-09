import { AsServedSet, AsServedImage } from '@/db/models/foods';
import { InternalServerError } from '@/http/errors';
import { AsServedImageResponse, AsServedSetResponse } from '@common/types/http/foods/portion-sizes';

export const asServedImageResponse = (item: AsServedImage): AsServedImageResponse => {
  const { image, thumbnailImage } = item;

  if (!image || !thumbnailImage)
    throw new InternalServerError('asServedImageResponse: not loaded relationships.');

  return {
    imageUrl: image.path,
    thumbnailUrl: thumbnailImage.path,
    weight: item.weight,
  };
};

export const asServedSetResponse = (item: AsServedSet): AsServedSetResponse => {
  const { selectionImage, asServedImages } = item;

  if (!selectionImage || !asServedImages)
    throw new InternalServerError('asServedSetResponse: not loaded relationships.');

  return {
    id: item.id,
    description: item.description,
    selectionImagePath: selectionImage.path,
    images: asServedImages.map(asServedImageResponse),
  };
};
