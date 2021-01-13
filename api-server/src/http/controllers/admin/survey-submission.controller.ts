import { Request, Response } from 'express';
import { Survey, SurveySubmission } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import { SurveySubmissionResponse, SurveySubmissionsResponse } from '@common/types/http';
import { Controller } from '../controller';

export type AdminSurveySubmissionController = Controller<'list' | 'entry' | 'destroy'>;

export default (): AdminSurveySubmissionController => {
  const list = async (req: Request, res: Response<SurveySubmissionsResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    const submissions = await SurveySubmission.paginate({
      req,
      columns: ['id', 'surveyId'],
      where: { surveyId },
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
    list,
    entry,
    destroy,
  };
};
