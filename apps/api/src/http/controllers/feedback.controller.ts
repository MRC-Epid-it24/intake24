import { Request, Response } from 'express';
import { PhysicalActivityLevel } from '@api/db/models/foods';
import {
  PhysicalActivityLevelsResponse,
  WeightTargetsResponse,
  HenryCoefficientsResponse,
} from '@common/types/http';
import { henryCoefficientsData, weightTargetsData } from '@common/feedback';
import { Controller } from './controller';

export type FeedbackController = Controller<
  'henryCoefficients' | 'physicalActivityLevels' | 'weightTargets'
>;

export default (): FeedbackController => {
  const henryCoefficients = async (
    req: Request,
    res: Response<HenryCoefficientsResponse>
  ): Promise<void> => {
    res.json(henryCoefficientsData);
  };

  const physicalActivityLevels = async (
    req: Request,
    res: Response<PhysicalActivityLevelsResponse>
  ): Promise<void> => {
    const data = await PhysicalActivityLevel.findAll({ order: [['id', 'ASC']] });

    res.json(data);
  };

  const weightTargets = async (
    req: Request,
    res: Response<WeightTargetsResponse>
  ): Promise<void> => {
    res.json(weightTargetsData);
  };

  return {
    henryCoefficients,
    physicalActivityLevels,
    weightTargets,
  };
};
