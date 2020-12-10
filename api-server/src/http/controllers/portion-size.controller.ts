import { Request, Response } from 'express';
import type { IoC } from '@/ioc';
import { asServedResponse } from '@/http/responses/foods';
import { Controller } from './controller';

export type PortionSizeController = Controller<
  | 'asServed'
  | 'asServedEntry'
  | 'guideImage'
  | 'guideImageEntry'
  | 'imageMaps'
  | 'imageMapsEntry'
  | 'drinkwareEntry'
  | 'weight'
>;

export default ({ config, portionSizeService }: IoC): PortionSizeController => {
  const baseUrl = config.app.urls.images;

  const asServed = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string | string[];

    const asServedSets = await portionSizeService.getAsServedSets(id);

    res.json(asServedSets.map(asServedResponse(baseUrl).setResponse));
  };

  const asServedEntry = async (req: Request, res: Response): Promise<void> => {
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
    res.json();
  };

  const imageMapsEntry = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    res.json();
  };

  const drinkwareEntry = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    res.json();
  };

  const weight = async (req: Request, res: Response): Promise<void> => {
    res.json();
  };

  return {
    asServed,
    asServedEntry,
    guideImage,
    guideImageEntry,
    imageMaps,
    imageMapsEntry,
    drinkwareEntry,
    weight,
  };
};
