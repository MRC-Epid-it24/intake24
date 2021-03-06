import { DrinkwareScale, DrinkwareSet } from '@/db/models/foods';
import { InternalServerError } from '@/http/errors';
import { DrinkwareSetResponse, DrinkwareScaleResponse } from '@common/types/http';

export interface DrinkwareResponse {
  scaleResponse: (item: DrinkwareScale) => DrinkwareScaleResponse;
  setResponse: (item: DrinkwareSet) => DrinkwareSetResponse;
}

export default (baseUrl: string): DrinkwareResponse => {
  const scaleResponse = (item: DrinkwareScale): DrinkwareScaleResponse => {
    const { baseImageUrl, overlayImageUrl, volumeSamples } = item;

    if (!volumeSamples)
      throw new InternalServerError('DrinkwareScaleResponse: not loaded relationships.');

    return {
      baseImageUrl: `${baseUrl}/${baseImageUrl}`,
      overlayImageUrl: `${baseUrl}/${overlayImageUrl}`,
      choiceId: item.choiceId,
      width: item.width,
      height: item.height,
      emptyLevel: item.emptyLevel,
      fullLevel: item.fullLevel,
      volumeSamples: volumeSamples.map(({ fill, volume }) => ({ fill, volume })),
    };
  };

  const setResponse = (item: DrinkwareSet): DrinkwareSetResponse => {
    const { id, guideImageId, scales } = item;

    if (!scales) throw new InternalServerError('DrinkwareSetResponse: not loaded relationships.');

    return { id, guideImageId, scales: scales.map(scaleResponse) };
  };

  return { setResponse, scaleResponse };
};
