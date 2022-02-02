import { Request, Response } from 'express';
import { FeedbackData } from '@intake24/common/types/http/feedback';
import type { IoC } from '@intake24/api/ioc';
import { Controller } from './controller';

export type FeedbackController = Controller<'data'>;

export default ({ feedbackService }: Pick<IoC, 'feedbackService'>): FeedbackController => {
  const data = async (req: Request, res: Response<FeedbackData>): Promise<void> => {
    const [demographicGroups, nutrientTypes, physicalActivityLevels, weightTargets] =
      await Promise.all([
        feedbackService.getDemographicGroups(),
        feedbackService.getNutrientTypes(),
        feedbackService.getPhysicalActivityLevels(),
        feedbackService.getWeightTargets(),
      ]);

    res.json({
      demographicGroups,
      nutrientTypes,
      physicalActivityLevels,
      weightTargets,
    });
  };

  return { data };
};
