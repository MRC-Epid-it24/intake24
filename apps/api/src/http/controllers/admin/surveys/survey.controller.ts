import { Request, Response } from 'express';
import { pick } from 'lodash';
import { WhereOptions } from 'sequelize';
import {
  CreateSurveyResponse,
  SurveyListEntry,
  SurveyResponse,
  SurveyRefs,
  SurveysResponse,
  StoreSurveyResponse,
} from '@common/types/http/admin';
import { SurveyAttributes } from '@common/types/models';
import { Language, Locale, Scheme, Survey } from '@api/db/models/system';
import { ForbiddenError, NotFoundError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { surveyListResponse, surveyResponse } from '@api/http/responses/admin';
import { staffSuffix } from '@api/services/core/auth';
import { Controller, CrudActions } from '../../controller';

export type AdminSurveyController = Controller<CrudActions>;

export default ({ aclConfig }: Pick<IoC, 'aclConfig'>): AdminSurveyController => {
  const refs = async (): Promise<SurveyRefs> => {
    const [languages, locales, schemes] = await Promise.all([
      Language.findAll(),
      Locale.findAll(),
      Scheme.findAll(),
    ]);

    return { languages, locales, schemes };
  };

  const entry = async (req: Request, res: Response<SurveyResponse>): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    res.json({ data: surveyResponse(survey), refs: await refs() });
  };

  const browse = async (req: Request, res: Response<SurveysResponse>): Promise<void> => {
    const permissions = (await req.scope.cradle.aclService.getPermissions()).map(
      (permission) => permission.name
    );

    const where: WhereOptions<SurveyAttributes> = {};
    if (!permissions.includes(aclConfig.permissions.surveyadmin)) {
      const surveys = permissions
        .filter((permission) => permission.endsWith(staffSuffix))
        .map((permission) => permission.replace(staffSuffix, ''));

      where.id = surveys;
    }

    const surveys = await Survey.paginate<SurveyListEntry>({
      req,
      columns: ['id', 'name'],
      where,
      order: [['id', 'ASC']],
      transform: surveyListResponse,
    });

    res.json(surveys);
  };

  const create = async (req: Request, res: Response<CreateSurveyResponse>): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (req: Request, res: Response<StoreSurveyResponse>): Promise<void> => {
    const survey = await Survey.create(
      pick(req.body, [
        'id',
        'name',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'allowGenUsers',
        'genUserKey',
        'authUrlDomainOverride',
        'authUrlTokenCharset',
        'authUrlTokenLength',
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
        'overrides',
      ])
    );

    res.status(201).json({ data: surveyResponse(survey) });
  };

  const read = async (req: Request, res: Response<SurveyResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<SurveyResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<SurveyResponse>): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    await survey.update(
      pick(req.body, [
        'name',
        'state',
        'startDate',
        'endDate',
        'schemeId',
        'localeId',
        'allowGenUsers',
        'genUserKey',
        'authUrlDomainOverride',
        'authUrlTokenCharset',
        'authUrlTokenLength',
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
        'overrides',
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
    read,
    edit,
    update,
    destroy,
  };
};
