import type { Request, Response } from 'express';

import type { IoC } from '@intake24/api/ioc';
import type { SurveySubmissionEntry } from '@intake24/common/types/http';
import type { User } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { Survey } from '@intake24/db';

const userSubmissionsController = ({
  cache,
  cacheConfig,
  surveyService,
}: Pick<IoC, 'cache' | 'cacheConfig' | 'surveyService'>) => {
  const submissions = async (
    req: Request<any, any, any, { survey: string | string[] }>,
    res: Response<SurveySubmissionEntry[]>
  ): Promise<void> => {
    const { survey: slug } = req.query;
    const { id: userId } = req.user as User;

    const survey = await (typeof slug === 'string'
      ? Survey.findBySlug(slug)
      : Survey.findOne({ where: { slug } }));
    if (!survey) throw new NotFoundError();

    const data = await cache.remember(`user-submissions:${userId}`, cacheConfig.ttl, async () =>
      surveyService.getSubmissions({ userId, surveyId: survey.id })
    );

    res.json(data as SurveySubmissionEntry[]);
  };

  return { submissions };
};

export default userSubmissionsController;

export type UserSubmissionsController = ReturnType<typeof userSubmissionsController>;
