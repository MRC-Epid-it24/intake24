import { AsServedImageResponse, AsServedSetResponse } from '@common/types/http';
import { AsServedSet, AsServedImage } from '@api/db/models/foods';
import { InternalServerError } from '@api/http/errors';

export interface AsServedResponse {
  imageResponse: (item: AsServedImage) => AsServedImageResponse;
  setResponse: (item: AsServedSet) => AsServedSetResponse;
}

export default (baseUrl: string): AsServedResponse => {
  const imageResponse = (item: AsServedImage): AsServedImageResponse => {
    const { image, thumbnailImage, weight } = item;

    if (!image || !thumbnailImage)
      throw new InternalServerError('AsServedImageResponse: not loaded relationships.');

    return {
      mainImageUrl: `${baseUrl}/${image.path}`,
      thumbnailUrl: `${baseUrl}/${thumbnailImage.path}`,
      weight,
    };
  };

  const setResponse = (item: AsServedSet): AsServedSetResponse => {
    const { id, description, selectionImage, asServedImages } = item;

    if (!selectionImage || !asServedImages)
      throw new InternalServerError('AsServedSetResponse: not loaded relationships.');

    return {
      id,
      description,
      selectionImageUrl: `${baseUrl}/${selectionImage.path}`,
      images: asServedImages.map(imageResponse),
    };
  };

  return { imageResponse, setResponse };
};
