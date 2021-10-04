import { Request, Response } from 'express';
import { AsServedSetResponse, DrinkwareSetResponse, WeightResponse } from '@common/types/http';
import type { IoC } from '@api/ioc';
import { asServedResponse, drinkwareResponse, imageMapsResponse } from '@api/http/responses/foods';
import { Controller } from './controller';

export type PortionSizeController = Controller<
  | 'asServedSet'
  | 'asServedSets'
  | 'drinkwareSet'
  | 'drinkwareSets'
  | 'guideImage'
  | 'guideImages'
  | 'imageMap'
  | 'imageMaps'
  | 'weight'
>;

export default ({
  imagesBaseUrl,
  portionSizeService,
}: Pick<IoC, 'imagesBaseUrl' | 'portionSizeService'>): PortionSizeController => {
  const asServedSet = async (req: Request, res: Response<AsServedSetResponse>): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getAsServedSet(id);

    res.json(asServedResponse(imagesBaseUrl).setResponse(record));
  };

  const asServedSets = async (
    req: Request,
    res: Response<AsServedSetResponse[]>
  ): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getAsServedSets(id);

    res.json(records.map(asServedResponse(imagesBaseUrl).setResponse));
  };

  const drinkwareSet = async (req: Request, res: Response<DrinkwareSetResponse>): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getDrinkwareSet(id);

    res.json(drinkwareResponse(imagesBaseUrl).setResponse(record));
  };

  const drinkwareSets = async (
    req: Request,
    res: Response<DrinkwareSetResponse[]>
  ): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getDrinkwareSets(id);

    res.json(records.map(drinkwareResponse(imagesBaseUrl).setResponse));
  };

  const guideImage = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getGuideImage(id);

    res.json(imageMapsResponse(imagesBaseUrl).guideResponse(record));
  };

  const guideImages = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getGuideImages(id);

    res.json(records.map(imageMapsResponse(imagesBaseUrl).guideResponse));

    res.json();
  };

  const imageMap = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getImageMap(id);

    res.json(imageMapsResponse(imagesBaseUrl).imageResponse(record));
  };

  const imageMaps = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getImageMaps(id);

    res.json(records.map(imageMapsResponse(imagesBaseUrl).imageResponse));
  };

  const weight = async (req: Request, res: Response<WeightResponse>): Promise<void> => {
    res.json({
      method: 'weight',
      description: 'weight',
      parameters: {},
      imageUrl: `${imagesBaseUrl}/portion/weight.png`,
      useForRecipes: true,
      conversionFactor: 1.0,
    });
  };

  return {
    asServedSet,
    asServedSets,
    drinkwareSet,
    drinkwareSets,
    guideImage,
    guideImages,
    imageMap,
    imageMaps,
    weight,
  };
};
