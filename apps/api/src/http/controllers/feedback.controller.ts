import type { Request, Response } from 'express';
import type { FeedbackData } from '@intake24/common/types/http/feedback';
import type { IoC } from '@intake24/api/ioc';

const feedbackController = ({ cache, feedbackService }: Pick<IoC, 'cache' | 'feedbackService'>) => {
  const data = async (req: Request, res: Response<FeedbackData>): Promise<void> => {
    const [nutrientTypes, physicalActivityLevels, weightTargets] = await cache.remember(
      'feedback:data',
      '7d',
      async () =>
        Promise.all([
          feedbackService.getNutrientTypes(),
          feedbackService.getPhysicalActivityLevels(),
          feedbackService.getWeightTargets(),
        ])
    );

    res.json({ nutrientTypes, physicalActivityLevels, weightTargets });
  };

  return { data };
};

export default feedbackController;

export type FeedbackController = ReturnType<typeof feedbackController>;
