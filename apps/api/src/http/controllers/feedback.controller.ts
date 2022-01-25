import { Request, Response } from 'express';
import { FeedbackData } from '@intake24/common/types/http/feedback';
import type { IoC } from '@intake24/api/ioc';
import { Controller } from './controller';

export type FeedbackController = Controller<'data'>;

export default ({ feedbackService }: Pick<IoC, 'feedbackService'>): FeedbackController => {
  const data = async (req: Request, res: Response<FeedbackData>): Promise<void> => {
    const [
      demographicGroups,
      fiveADay,
      foodGroups,
      henryCoefficients,
      nutrientTypes,
      physicalActivityLevels,
      weightTargets,
    ] = await Promise.all([
      feedbackService.getDemographicGroups(),
      feedbackService.getFiveADay(),
      feedbackService.getFoodGroups(),
      feedbackService.getHenryCoefficients(),
      feedbackService.getNutrientTypes(),
      feedbackService.getPhysicalActivityLevels(),
      feedbackService.getWeightTargets(),
    ]);

    res.json({
      demographicGroups,
      fiveADay,
      foodGroups,
      henryCoefficients,
      nutrientTypes,
      physicalActivityLevels,
      weightTargets,
    });
  };

  return { data };
};
