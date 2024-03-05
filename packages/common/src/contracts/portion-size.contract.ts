import { initContract } from '@ts-rest/core';
import { z } from 'zod';

import {
  asServedSetResponse,
  drinkwareSetResponse,
  guideImageResponse,
  imageMapResponse,
  standardUnitResponse,
  weightResponse,
} from '../types/http';

export const portionSize = initContract().router({
  asServedSets: {
    method: 'GET',
    path: '/portion-sizes/as-served-sets',
    query: z.object({
      id: z.union([z.string(), z.string().array()]),
    }),
    responses: {
      200: asServedSetResponse.array(),
    },
    summary: 'Get multiple as served sets',
  },
  asServedSet: {
    method: 'GET',
    path: '/portion-sizes/as-served-sets/:id',
    responses: {
      200: asServedSetResponse,
    },
    summary: 'Get single as served set',
  },
  drinkwareSets: {
    method: 'GET',
    path: '/portion-sizes/drinkware-sets',
    query: z.object({
      id: z.union([z.string(), z.string().array()]),
    }),
    responses: {
      200: drinkwareSetResponse.array(),
    },
    summary: 'Get multiple drinkware sets',
  },
  drinkwareSet: {
    method: 'GET',
    path: '/portion-sizes/drinkware-sets/:id',
    responses: {
      200: drinkwareSetResponse,
    },
    summary: 'Get single drinkware set',
  },
  guideImages: {
    method: 'GET',
    path: '/portion-sizes/guide-images',
    query: z.object({
      id: z.union([z.string(), z.string().array()]),
    }),
    responses: {
      200: guideImageResponse.array(),
    },
    summary: 'Get multiple guide images',
  },
  guideImage: {
    method: 'GET',
    path: '/portion-sizes/guide-images/:id',
    responses: {
      200: guideImageResponse,
    },
    summary: 'Get single guide image',
  },
  imageMaps: {
    method: 'GET',
    path: '/portion-sizes/image-maps',
    query: z.object({
      id: z.union([z.string(), z.string().array()]),
    }),
    responses: {
      200: imageMapResponse.array(),
    },
    summary: 'Get multiple image maps',
  },
  imageMap: {
    method: 'GET',
    path: '/portion-sizes/image-maps/:id',
    responses: {
      200: imageMapResponse,
    },
    summary: 'Get single image map',
  },
  standardUnits: {
    method: 'GET',
    path: '/portion-sizes/standard-units',
    query: z.object({
      id: z.union([z.string(), z.string().array()]),
    }),
    responses: {
      200: standardUnitResponse.array(),
    },
    summary: 'Get multiple standard units',
  },
  standardUnit: {
    method: 'GET',
    path: '/portion-sizes/standard-units/:id',
    responses: {
      200: standardUnitResponse,
    },
    summary: 'Get single standard unit',
  },
  weight: {
    method: 'GET',
    path: '/portion-sizes/weight',
    responses: {
      200: weightResponse,
    },
    summary: 'Get weight',
  },
});
