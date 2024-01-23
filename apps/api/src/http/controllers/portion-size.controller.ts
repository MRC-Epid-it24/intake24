import type { Request, Response } from 'express';
import { omit } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  AsServedSetResponse,
  DrinkwareSetResponse,
  GuideImageResponse,
  ImageMapResponse,
  StandardUnitResponse,
  WeightResponse,
} from '@intake24/common/types/http';
import { asServedResponse, imageMapsResponse } from '@intake24/api/http/responses/foods';

const portionSizeController = ({
  imagesBaseUrl,
  portionSizeService,
  drinkwareSetService,
}: Pick<IoC, 'imagesBaseUrl' | 'portionSizeService' | 'drinkwareSetService'>) => {
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

    const drinkwareSet = omit(await drinkwareSetService.getDrinkwareSet(id), 'description');

    res.json(drinkwareSet);
  };

  const drinkwareSets = async (
    req: Request,
    res: Response<DrinkwareSetResponse[]>
  ): Promise<void> => {
    const id = req.query.id as string | string[];

    // Is this used anywhere?
    throw new Error('Not implemented');
  };

  const guideImage = async (req: Request, res: Response<GuideImageResponse>): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getGuideImage(id);

    res.json(imageMapsResponse(imagesBaseUrl).guideResponse(record));
  };

  const guideImages = async (req: Request, res: Response<GuideImageResponse[]>): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getGuideImages(id);

    res.json(records.map(imageMapsResponse(imagesBaseUrl).guideResponse));

    res.json();
  };

  const imageMap = async (req: Request, res: Response<ImageMapResponse>): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getImageMap(id);

    res.json(imageMapsResponse(imagesBaseUrl).imageResponse(record));
  };

  const imageMaps = async (req: Request, res: Response<ImageMapResponse[]>): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getImageMaps(id);

    res.json(records.map(imageMapsResponse(imagesBaseUrl).imageResponse));
  };

  const standardUnit = async (req: Request, res: Response<StandardUnitResponse>): Promise<void> => {
    const { id } = req.params;

    const record = await portionSizeService.getStandardUnit(id);

    res.json(record);
  };

  const standardUnits = async (
    req: Request,
    res: Response<StandardUnitResponse[]>
  ): Promise<void> => {
    const id = req.query.id as string | string[];

    const records = await portionSizeService.getStandardUnits(id);

    res.json(records);
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
    standardUnit,
    standardUnits,
    weight,
  };
};

export default portionSizeController;

export type PortionSizeController = ReturnType<typeof portionSizeController>;
