import { Request, Response } from 'express';
import { WhereOptions } from 'sequelize';
import { Survey, SurveySubmission } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import { SurveySubmissionResponse, SurveySubmissionsResponse } from '@common/types/http';
import { validate } from 'uuid';
import { Controller } from '../controller';

export type AdminSurveySubmissionController = Controller<'browse' | 'entry' | 'destroy'>;

export default (): AdminSurveySubmissionController => {
  const browse = async (req: Request, res: Response<SurveySubmissionsResponse>): Promise<void> => {
    const {
      params: { surveyId },
      query: { search },
    } = req;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const where: WhereOptions = { surveyId };
    if (typeof search === 'string' && search) {
      if (validate(search)) where.id = search;
      else where.userId = search;
    }

    const submissions = await SurveySubmission.paginate({
      req,
      where,
      order: [['submissionTime', 'DESC']],
    });

    res.json(submissions);
  };

  const entry = async (req: Request, res: Response<SurveySubmissionResponse>): Promise<void> => {
    const { surveyId, submissionId } = req.params;

    const submission = await SurveySubmission.findOne({ where: { id: submissionId, surveyId } });
    if (!submission) throw new NotFoundError();

    res.json({ data: submission });
  };

  const destroy = async (req: Request, res: Response): Promise<void> => {
    const { surveyId, submissionId } = req.params;

    await SurveySubmission.destroy({ where: { id: submissionId, surveyId } });

    res.status(204).json();
  };

  return {
    browse,
    entry,
    destroy,
  };
};
