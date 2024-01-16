import type { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';
import { omit, result } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  AsServedSetResponse,
  DrinkwareSetResponse,
  GuideImageResponse,
  ImageMapResponse,
  StandardUnitResponse,
  WeightResponse,
} from '@intake24/common/types/http';
import type { DrinkwareSetEntry } from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';
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

  // Omit fields unnecessary for the survey app
  const toSurveyRepsonse = (entry: DrinkwareSetEntry): DrinkwareSetResponse => {
    return {
      // description intentionally omitted
      id: entry.id,
      imageMapId: entry.imageMapId,
      scales: entry.scales.map((scale) => {
        switch (scale.version) {
          case 1:
            return scale;
          case 2:
            return omit(scale, 'volumeSamples');
        }
      }),
    };
  };

  const drinkwareSet = async (req: Request, res: Response<DrinkwareSetResponse>): Promise<void> => {
    const { id } = req.params;

    const drinkwareSetEntry = await drinkwareSetService.getDrinkwareSet(id);

    if (drinkwareSetEntry === undefined) throw new NotFoundError();

    res.json(toSurveyRepsonse(drinkwareSetEntry));
  };

  // This is implemented to make the tests pass, but it doesn't look like this function
  // is used anywhere so the implementation is inefficient
  const drinkwareSets = async (
    req: Request,
    res: Response<DrinkwareSetResponse[]>
  ): Promise<void> => {
    const id = req.query.id as string | string[];

    switch (typeof id) {
      case 'string': {
        const drinkwareSetEntry = await drinkwareSetService.getDrinkwareSet(id);
        if (drinkwareSetEntry === undefined) throw new NotFoundError();
        res.json([toSurveyRepsonse(drinkwareSetEntry)]);
        return;
      }
      case 'object':
        if (Array.isArray(id)) {
          const lookupResults = await Promise.all(
            id.map((setId) => drinkwareSetService.getDrinkwareSet(setId))
          );
          const successfulResults = lookupResults.filter(
            (entry): entry is DrinkwareSetEntry => entry !== undefined
          );
          res.json(successfulResults.map(toSurveyRepsonse));
          return;
        }
        break;
    }

    res.json([]);
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
