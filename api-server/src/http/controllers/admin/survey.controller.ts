import { Request, Response } from 'express';
import { pick } from 'lodash';
import { WhereOptions } from 'sequelize';
import { Locale, Scheme, Survey, User } from '@/db/models/system';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import { surveyResponse } from '@/http/responses/admin';
import { staffSuffix } from '@/services/acl.service';
import {
  CreateSurveyResponse,
  SurveyResponse,
  SurveyRefs,
  SurveysResponse,
  StoreSurveyResponse,
} from '@common/types/http';
import { Controller, CrudActions } from '../controller';

export type AdminSurveyController = Controller<CrudActions>;

export default ({ config }: Pick<IoC, 'config'>): AdminSurveyController => {
  const refs = async (): Promise<SurveyRefs> => {
    const locales = await Locale.findAll();
    const schemes = await Scheme.findAll({ attributes: ['id', 'name'] });

    return { locales, schemes };
  };

  const entry = async (req: Request, res: Response<SurveyResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    res.json({ data: surveyResponse(survey), refs: await refs() });
  };

  const browse = async (req: Request, res: Response<SurveysResponse>): Promise<void> => {
    const permissions = (req.user as User).allPermissions().map((permission) => permission.name);

    const where: WhereOptions = {};
    if (!permissions.includes(config.acl.permissions.surveyadmin)) {
      const surveys = permissions
        .filter((permission) => permission.endsWith(staffSuffix))
        .map((permission) => permission.replace(staffSuffix, ''));

      where.id = surveys;
    }

    const surveys = await Survey.paginate({ req, columns: ['id'], where, order: [['id', 'ASC']] });

    res.json(surveys);
  };

  const create = async (req: Request, res: Response<CreateSurveyResponse>): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (req: Request, res: Response<StoreSurveyResponse>): Promise<void> => {
    const survey = await Survey.create(
      pick(req.body, [
        'id',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'allowGenUsers',
        'genUserKey',
        'authUrlDomainOverride',
        'suspensionReason',
        'surveyMonkeyUrl',
        'supportEmail',
        'originatingUrl',
        'description',
        'feedbackEnabled',
        'feedbackStyle',
        'submissionNotificationUrl',
        'storeUserSessionOnServer',
        'numberOfSubmissionsForFeedback',
        'finalPageHtml',
        'maximumDailySubmissions',
        'maximumTotalSubmissions',
        'minimumSubmissionInterval',
      ])
    );

    res.status(201).json({ data: surveyResponse(survey) });
  };

  const detail = async (req: Request, res: Response<SurveyResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<SurveyResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<SurveyResponse>): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    await survey.update(
      pick(req.body, [
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'allowGenUsers',
        'genUserKey',
        'authUrlDomainOverride',
        'suspensionReason',
        'surveyMonkeyUrl',
        'supportEmail',
        'originatingUrl',
        'description',
        'feedbackEnabled',
        'feedbackStyle',
        'submissionNotificationUrl',
        'storeUserSessionOnServer',
        'numberOfSubmissionsForFeedback',
        'finalPageHtml',
        'maximumDailySubmissions',
        'maximumTotalSubmissions',
        'minimumSubmissionInterval',
      ])
    );

    res.json({ data: surveyResponse(survey), refs: await refs() });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { surveyId } = req.params;
    const survey = await Survey.scope('submissions').findByPk(surveyId);

    if (!survey) throw new NotFoundError();

    if (survey.submissions?.length)
      throw new ForbiddenError('Survey cannot be deleted. It already contains submission data.');

    await survey.destroy();

    res.status(204).json();
  };

  return {
    browse,
    create,
    store,
    detail,
    edit,
    update,
    destroy,
  };
};
