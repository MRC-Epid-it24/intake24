import type { Request, Response } from 'express';
import { User, Survey } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import type { SurveySubmissionEntry } from '@intake24/common/types/http';
import { NotFoundError } from '@intake24/api/http/errors';
import type { Controller } from '../controller';

export type UserSubmissionsController = Controller<'submissions'>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): UserSubmissionsController => {
  const submissions = async (
    req: Request<any, any, any, { survey: string | string[] }>,
    res: Response<SurveySubmissionEntry[]>
  ): Promise<void> => {
    const { survey: slug } = req.query;
    const { id: userId } = req.user as User;

    const survey = await Survey.findOne({ where: { slug } });
    if (!survey) throw new NotFoundError();

    const data = await surveyService.getSubmissions({ userId, surveyId: survey.id });

    res.json(data as SurveySubmissionEntry[]);
  };

  return { submissions };
};
