import { Request, Response } from 'express';
import type { IoC } from '@/ioc';
import { asServedSetResponse } from '@/http/responses/foods';
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

export default ({ portionSizeService }: IoC): PortionSizeController => {
  const asServed = async (req: Request, res: Response): Promise<void> => {
    const id = req.query.id as string | string[];

    const asServedSets = await portionSizeService.getAsServedSets(id);

    res.json(asServedSets.map(asServedSetResponse));
  };

  const asServedEntry = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const asServedSet = await portionSizeService.getAsServedSet(id);

    res.json(asServedSetResponse(asServedSet));
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
