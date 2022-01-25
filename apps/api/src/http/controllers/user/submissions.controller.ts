import { Request, Response } from 'express';
import { User } from '@intake24/db';
import type { IoC } from '@intake24/api/ioc';
import { SurveySubmissionEntry } from '@intake24/common/types/http';
import { Controller } from '../controller';

export type UserSubmissionsController = Controller<'submissions'>;

export default ({ surveyService }: Pick<IoC, 'surveyService'>): UserSubmissionsController => {
  const submissions = async (
    req: Request<any, any, any, { surveyId: string | string[] }>,
    res: Response<SurveySubmissionEntry[]>
  ): Promise<void> => {
    const { surveyId } = req.query;
    const { id: userId } = req.user as User;

    const data = await surveyService.getSubmissions({ userId, surveyId });

    res.json(data as SurveySubmissionEntry[]);
  };

  return { submissions };
};
