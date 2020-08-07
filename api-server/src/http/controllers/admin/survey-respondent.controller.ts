import { Request, Response, NextFunction } from 'express';
import { pick } from 'lodash';
import { RespondentResponse } from '@common/types/api/admin/users';
import { Survey, UserSurveyAlias } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import userRespondentResponse from '@/http/responses/admin/user-respondent.response';
import surveySvc from '@/services/survey.service';

export default {
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) {
      next(new NotFoundError());
      return;
    }

    const respondents = await UserSurveyAlias.scope('user').paginate<RespondentResponse>({
      req,
      columns: ['userName'],
      where: { surveyId },
      transform: userRespondentResponse,
    });

    res.json(respondents);
  },

  async store(req: Request, res: Response): Promise<void> {
    const { surveyId } = req.params;

    const { respondent } = await surveySvc.createRespondent(
      surveyId,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password'])
    );

    res.status(201).json({ data: respondent });
  },

  async update(req: Request, res: Response): Promise<void> {
    const { surveyId, userId } = req.params;

    const respondent = await surveySvc.updateRespondent(
      surveyId,
      userId,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password'])
    );

    res.json({ data: respondent });
  },

  async delete(req: Request, res: Response): Promise<void> {
    const { surveyId, userId } = req.params;

    await surveySvc.deleteRespondent(surveyId, userId);
    res.status(204).json();
  },
};
