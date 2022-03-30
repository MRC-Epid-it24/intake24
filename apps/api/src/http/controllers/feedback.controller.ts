import type { Request, Response } from 'express';
import type { FeedbackData } from '@intake24/common/types/http/feedback';
import type { IoC } from '@intake24/api/ioc';
import type { Controller } from './controller';

export type FeedbackController = Controller<'data'>;

export default ({ feedbackService }: Pick<IoC, 'feedbackService'>): FeedbackController => {
  const data = async (req: Request, res: Response<FeedbackData>): Promise<void> => {
    const [nutrientTypes, physicalActivityLevels, weightTargets] = await Promise.all([
      feedbackService.getNutrientTypes(),
      feedbackService.getPhysicalActivityLevels(),
      feedbackService.getWeightTargets(),
    ]);

    res.json({
      nutrientTypes,
      physicalActivityLevels,
      weightTargets,
    });
  };

  return { data };
};
