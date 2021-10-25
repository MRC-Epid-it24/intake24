import { Request, Response } from 'express';
import { PhysicalActivityLevel } from '@api/db/models/foods';
import {
  PhysicalActivityLevelsResponse,
  WeightTargetsResponse,
  HenryCoefficientsResponse,
  HenryCoefficient,
} from '@common/types/http';
import { Sex } from '@common/types/models';
import { Controller } from './controller';

export type FeedbackController = Controller<
  'henryCoefficients' | 'physicalActivityLevels' | 'weightTargets'
>;

export default (): FeedbackController => {
  const henryCoefficients = async (
    req: Request,
    res: Response<HenryCoefficientsResponse>
  ): Promise<void> => {
    // TODO: move to database?
    const data: HenryCoefficient[] = [
      {
        sex: 'm',
        ageRange: [0, 3],
        weightCoefficient: 28.2,
        heightCoefficient: 859,
        constant: -371,
      },
      {
        sex: 'm',
        ageRange: [3, 10],
        weightCoefficient: 15.1,
        heightCoefficient: 313,
        constant: 306,
      },
      {
        sex: 'm',
        ageRange: [10, 18],
        weightCoefficient: 15.6,
        heightCoefficient: 266,
        constant: 299,
      },
      {
        sex: 'm',
        ageRange: [18, 30],
        weightCoefficient: 14.4,
        heightCoefficient: 313,
        constant: 113,
      },
      {
        sex: 'm',
        ageRange: [30, 60],
        weightCoefficient: 11.4,
        heightCoefficient: 541,
        constant: -137,
      },
      {
        sex: 'm',
        ageRange: [60, Number.MAX_VALUE],
        weightCoefficient: 11.4,
        heightCoefficient: 541,
        constant: -256,
      },
      {
        sex: 'f',
        ageRange: [0, 3],
        weightCoefficient: 30.4,
        heightCoefficient: 703,
        constant: -287,
      },
      {
        sex: 'f',
        ageRange: [3, 10],
        weightCoefficient: 15.9,
        heightCoefficient: 210,
        constant: 349,
      },
      {
        sex: 'f',
        ageRange: [10, 18],
        weightCoefficient: 9.4,
        heightCoefficient: 249,
        constant: 462,
      },
      {
        sex: 'f',
        ageRange: [18, 30],
        weightCoefficient: 10.4,
        heightCoefficient: 615,
        constant: -282,
      },
      {
        sex: 'f',
        ageRange: [30, 60],
        weightCoefficient: 8.18,
        heightCoefficient: 502,
        constant: -11.6,
      },
      {
        sex: 'f',
        ageRange: [60, Number.MAX_VALUE],
        weightCoefficient: 8.52,
        heightCoefficient: 421,
        constant: 10.7,
      },
    ];

    res.json(data);
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
    // TODO: move to database?
    const data = [
      { id: 'keep_weight', name: 'Keep weight', coefficient: 0 },
      { id: 'lose_weight', name: 'Lose weight', coefficient: -500 },
      { id: 'gain_weight', name: 'Gain weight', coefficient: 500 },
    ];

    res.json(data);
  };

  return {
    henryCoefficients,
    physicalActivityLevels,
    weightTargets,
  };
};
