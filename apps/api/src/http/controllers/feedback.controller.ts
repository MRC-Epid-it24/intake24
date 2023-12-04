import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { FeedbackData } from '@intake24/common/types/http/feedback';

const feedbackController = ({
  cache,
  cacheConfig,
  feedbackService,
}: Pick<IoC, 'cache' | 'cacheConfig' | 'feedbackService'>) => {
  const data = async (req: Request, res: Response<FeedbackData>): Promise<void> => {
    const [nutrientTypes, physicalActivityLevels, weightTargets] = await cache.remember(
      'feedback-data',
      cacheConfig.ttl,
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
