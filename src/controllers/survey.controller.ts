import { Request, Response, NextFunction } from 'express';
import Survey from '@/db/models/system/survey';
import NotFoundError from '@/http/errors/not-found.error';

export default {
  async list(req: Request, res: Response): Promise<void> {
    const surveys = await Survey.scope('public').findAll();

    res.json(surveys);
  },

  async publicEntry(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.scope('public').findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    res.json(survey);
  },

  async entry(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.scope('respodent').findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    res.json(survey);
  },

  async userInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    res.json();
  },
};
