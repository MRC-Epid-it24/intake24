import { initServer } from '@ts-rest/express';
import { omit } from 'lodash';

import type { DrinkwareSetResponse } from '@intake24/common/types/http';
import type { DrinkwareSetEntry } from '@intake24/common/types/http/admin';
import { NotFoundError } from '@intake24/api/http/errors';
import { asServedResponse, imageMapsResponse } from '@intake24/api/http/responses/foods';
import { contract } from '@intake24/common/contracts';

// Omit fields unnecessary for the survey app
const toSurveyResponse = (entry: DrinkwareSetEntry): DrinkwareSetResponse => {
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

export const portionSize = () =>
  initServer().router(contract.portionSize, {
    asServedSets: async ({ query: { id }, req }) => {
      const { imagesBaseUrl } = req.scope.cradle;
      const records = await req.scope.cradle.portionSizeService.getAsServedSets(id);

      return {
        status: 200,
        body: records.map(asServedResponse(imagesBaseUrl).setResponse),
      };
    },
    asServedSet: async ({ params: { id }, req }) => {
      const { imagesBaseUrl } = req.scope.cradle;
      const record = await req.scope.cradle.portionSizeService.getAsServedSet(id);

      return {
        status: 200,
        body: asServedResponse(imagesBaseUrl).setResponse(record),
      };
    },
    drinkwareSets: async ({ query: { id }, req }) => {
      switch (typeof id) {
        case 'string': {
          const drinkwareSetEntry = await req.scope.cradle.drinkwareSetService.getDrinkwareSet(id);
          if (drinkwareSetEntry === undefined) throw new NotFoundError();
          return {
            status: 200,
            body: [toSurveyResponse(drinkwareSetEntry)],
          };
        }
        case 'object':
          if (Array.isArray(id)) {
            const lookupResults = await Promise.all(
              id.map((setId) => req.scope.cradle.drinkwareSetService.getDrinkwareSet(setId))
            );
            const successfulResults = lookupResults.filter(
              (entry): entry is DrinkwareSetEntry => entry !== undefined
            );
            return {
              status: 200,
              body: successfulResults.map(toSurveyResponse),
            };
          }
          break;
      }

      return { status: 200, body: [] };
    },
    drinkwareSet: async ({ params: { id }, req }) => {
      const drinkwareSetEntry = await req.scope.cradle.drinkwareSetService.getDrinkwareSet(id);

      if (drinkwareSetEntry === undefined) throw new NotFoundError();

      return {
        status: 200,
        body: toSurveyResponse(drinkwareSetEntry),
      };
    },
    guideImages: async ({ query: { id }, req }) => {
      const { imagesBaseUrl } = req.scope.cradle;
      const records = await req.scope.cradle.portionSizeService.getGuideImages(id);

      return {
        status: 200,
        body: records.map(imageMapsResponse(imagesBaseUrl).guideResponse),
      };
    },
    guideImage: async ({ params: { id }, req }) => {
      const { imagesBaseUrl } = req.scope.cradle;
      const record = await req.scope.cradle.portionSizeService.getGuideImage(id);

      return {
        status: 200,
        body: imageMapsResponse(imagesBaseUrl).guideResponse(record),
      };
    },
    imageMaps: async ({ query: { id }, req }) => {
      const { imagesBaseUrl } = req.scope.cradle;
      const records = await req.scope.cradle.portionSizeService.getImageMaps(id);

      return {
        status: 200,
        body: records.map(imageMapsResponse(imagesBaseUrl).imageResponse),
      };
    },
    imageMap: async ({ params: { id }, req }) => {
      const { imagesBaseUrl } = req.scope.cradle;
      const record = await req.scope.cradle.portionSizeService.getImageMap(id);

      return {
        status: 200,
        body: imageMapsResponse(imagesBaseUrl).imageResponse(record),
      };
    },
    standardUnits: async ({ query: { id }, req }) => {
      const records = await req.scope.cradle.portionSizeService.getStandardUnits(id);

      return {
        status: 200,
        body: records,
      };
    },
    standardUnit: async ({ params: { id }, req }) => {
      const record = await req.scope.cradle.portionSizeService.getStandardUnit(id);

      return {
        status: 200,
        body: record,
      };
    },
    weight: async ({ req }) => {
      const { imagesBaseUrl } = req.scope.cradle;

      return {
        status: 200,
        body: {
          method: 'weight',
          description: 'weight',
          parameters: {},
          imageUrl: `${imagesBaseUrl}/portion/weight.png`,
          useForRecipes: true,
          conversionFactor: 1.0,
        },
      };
    },
  });
