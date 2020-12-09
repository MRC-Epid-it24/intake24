import { Request, Response } from 'express';
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

export default (): PortionSizeController => {
  const asServed = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;
    res.json();
  };

  const asServedEntry = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    res.json();
  };

  const guideImage = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;
    res.json();
  };

  const guideImageEntry = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    res.json();
  };

  const imageMaps = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;
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
