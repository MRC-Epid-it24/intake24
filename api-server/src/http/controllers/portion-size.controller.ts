import { Request, Response } from 'express';
import type { IoC } from '@/ioc';
import { asServedResponse, drinkwareResponse, imageMapsResponse } from '@/http/responses/foods';
import { AsServedSetResponse, DrinkwareSetResponse, WeightResponse } from '@common/types/http';
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
  config,
  portionSizeService,
}: Pick<IoC, 'config' | 'portionSizeService'>): PortionSizeController => {
  const baseUrl = config.app.urls.images;

  const asServedSet = async (req: Request, res: Response<AsServedSetResponse>): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getAsServedSet(id);

    res.json(asServedResponse(baseUrl).setResponse(record));
  };

  const asServedSets = async (
    req: Request,
    res: Response<AsServedSetResponse[]>
  ): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getAsServedSets(id);

    res.json(records.map(asServedResponse(baseUrl).setResponse));
  };

  const drinkwareSet = async (req: Request, res: Response<DrinkwareSetResponse>): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getDrinkwareSet(id);

    res.json(drinkwareResponse(baseUrl).setResponse(record));
  };

  const drinkwareSets = async (
    req: Request,
    res: Response<DrinkwareSetResponse[]>
  ): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getDrinkwareSets(id);

    res.json(records.map(drinkwareResponse(baseUrl).setResponse));
  };

  const guideImage = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getGuideImage(id);

    res.json(imageMapsResponse(baseUrl).guideResponse(record));
  };

  const guideImages = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getGuideImages(id);

    res.json(records.map(imageMapsResponse(baseUrl).guideResponse));

    res.json();
  };

  const imageMap = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getImageMap(id);

    res.json(imageMapsResponse(baseUrl).imageResponse(record));
  };

  const imageMaps = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getImageMaps(id);

    res.json(records.map(imageMapsResponse(baseUrl).imageResponse));
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
