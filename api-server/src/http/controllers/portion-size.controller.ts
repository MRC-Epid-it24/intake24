import { Request, Response } from 'express';
import type { IoC } from '@/ioc';
import { asServedResponse, drinkwareResponse, imageMapResponse } from '@/http/responses/foods';
import { AsServedSetResponse, DrinkwareSetResponse, WeightResponse } from '@common/types/http';
import { Controller } from './controller';

export type PortionSizeController = Controller<
  | 'asServed'
  | 'asServedEntry'
  | 'guideImage'
  | 'guideImageEntry'
  | 'imageMaps'
  | 'imageMapsEntry'
  | 'drinkware'
  | 'drinkwareEntry'
  | 'weight'
>;

export default ({
  config,
  portionSizeService,
}: Pick<IoC, 'config' | 'portionSizeService'>): PortionSizeController => {
  const baseUrl = config.app.urls.images;

  const asServed = async (req: Request, res: Response<AsServedSetResponse[]>): Promise<void> => {
    const id = req.query.id as string | string[];

    const asServedSets = await portionSizeService.getAsServedSets(id);

    res.json(asServedSets.map(asServedResponse(baseUrl).setResponse));
  };

  const asServedEntry = async (req: Request, res: Response<AsServedSetResponse>): Promise<void> => {
    const { id } = req.params;

    const asServedSet = await portionSizeService.getAsServedSet(id);

    res.json(asServedResponse(baseUrl).setResponse(asServedSet));
  };

  const guideImage = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string | string[];
    res.json();
  };

  const guideImageEntry = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    res.json();
  };

  const imageMaps = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string | string[];

    const maps = await portionSizeService.getImageMaps(id);

    res.json(maps.map(imageMapResponse(baseUrl).imageResponse));
  };

  const imageMapsEntry = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const imageMap = await portionSizeService.getImageMap(id);

    res.json(imageMapResponse(baseUrl).imageResponse(imageMap));
  };

  const drinkware = async (req: Request, res: Response<DrinkwareSetResponse[]>): Promise<void> => {
    const id = req.query.id as string | string[];

    const drinkwareSets = await portionSizeService.getDrinkwareSets(id);

    res.json(drinkwareSets.map(drinkwareResponse(baseUrl).setResponse));
  };

  const drinkwareEntry = async (
    req: Request,
    res: Response<DrinkwareSetResponse>
  ): Promise<void> => {
    const { id } = req.params;

    const drinkwareSet = await portionSizeService.getDrinkwareSet(id);

    res.json(drinkwareResponse(baseUrl).setResponse(drinkwareSet));
  };

  const weight = async (req: Request, res: Response<WeightResponse>): Promise<void> => {
    res.json({
      method: 'weight',
      description: 'weight',
      parameters: {},
      imageUrl: `${baseUrl}/portion/weight.png`,
      useForRecipes: true,
      conversionFactor: 1.0,
    });
  };

  return {
    asServed,
    asServedEntry,
    guideImage,
    guideImageEntry,
    imageMaps,
    imageMapsEntry,
    drinkware,
    drinkwareEntry,
    weight,
  };
};
