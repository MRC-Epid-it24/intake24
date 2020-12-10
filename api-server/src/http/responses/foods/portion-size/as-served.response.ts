import { AsServedSet, AsServedImage } from '@/db/models/foods';
import { InternalServerError } from '@/http/errors';
import { AsServedImageResponse, AsServedSetResponse } from '@common/types/http/foods/portion-sizes';

export interface AsServedResponse {
  imageResponse: (item: AsServedImage) => AsServedImageResponse;
  setResponse: (item: AsServedSet) => AsServedSetResponse;
}

export default (baseUrl: string): AsServedResponse => {
  const imageResponse = (item: AsServedImage): AsServedImageResponse => {
    const { image, thumbnailImage } = item;

    if (!image || !thumbnailImage)
      throw new InternalServerError('asServedImageResponse: not loaded relationships.');

    return {
      mainImageUrl: `${baseUrl}/${image.path}`,
      thumbnailUrl: `${baseUrl}/${thumbnailImage.path}`,
      weight: item.weight,
    };
  };

  const setResponse = (item: AsServedSet): AsServedSetResponse => {
    const { selectionImage, asServedImages } = item;

    if (!selectionImage || !asServedImages)
      throw new InternalServerError('asServedSetResponse: not loaded relationships.');

    return {
      id: item.id,
      description: item.description,
      selectionImageUrl: `${baseUrl}/${selectionImage.path}`,
      images: asServedImages.map(imageResponse),
    };
  };

  return { imageResponse, setResponse };
};
