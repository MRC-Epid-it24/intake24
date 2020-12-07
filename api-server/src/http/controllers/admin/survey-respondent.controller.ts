import { Request, Response } from 'express';
import { pick } from 'lodash';
import { Survey, User, UserSurveyAlias } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import userRespondentResponse from '@/http/responses/admin/user-respondent.response';
import { RespondentResponse } from '@common/types/http/admin/users';
import type { IoC } from '@/ioc';
import { Controller } from '../controller';

export type AdminSurveyRespondentController = Controller<
  'list' | 'store' | 'update' | 'destroy' | 'upload' | 'exportAuthUrls'
>;

export default ({ surveyService }: IoC): AdminSurveyRespondentController => {
  const list = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    const respondents = await UserSurveyAlias.scope('user').paginate<RespondentResponse>({
      req,
      columns: ['userName'],
      where: { surveyId },
      transform: userRespondentResponse,
    });

    res.json(respondents);
  };

  const store = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;

    const { respondent } = await surveyService.createRespondent(
      surveyId,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password'])
    );

    res.status(201).json({ data: respondent });
  };

  const update = async (req: Request, res: Response): Promise<void> => {
    const { surveyId, userId } = req.params;

    const respondent = await surveyService.updateRespondent(
      surveyId,
      userId,
      pick(req.body, ['name', 'email', 'phone', 'userName', 'password'])
    );

    res.json({ data: respondent });
  };

  const destroy = async (req: Request, res: Response): Promise<void> => {
    const { surveyId, userId } = req.params;

    await surveyService.deleteRespondent(surveyId, userId);
    res.status(204).json();
  };

  const upload = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;
    const { file } = req;
    const { id: userId } = req.user as User;

    const job = await surveyService.importRespondents(surveyId, userId, file);

    res.json({ data: job });
  };

  const exportAuthUrls = async (req: Request, res: Response): Promise<void> => {
    const { surveyId } = req.params;
    const { id: userId } = req.user as User;

    const job = await surveyService.exportAuthenticationUrls(surveyId, userId);

    res.json({ data: job });
  };

  return {
    list,
    store,
    update,
    destroy,
    upload,
    exportAuthUrls,
  };
};
