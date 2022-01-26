import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  WhereOptions,
  Language,
  SystemLocale,
  Scheme,
  Survey,
  PaginateQuery,
  FeedbackScheme,
} from '@intake24/db';
import {
  SurveyEntry,
  SurveyListEntry,
  SurveyRefs,
  SurveysResponse,
} from '@intake24/common/types/http/admin';
import {
  createSurveyFields,
  overridesFields,
  staffUpdateSurveyFields,
  updateSurveyFields,
  SurveyAttributes,
} from '@intake24/common/types/models';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { surveyListResponse, surveyResponse } from '@intake24/api/http/responses/admin';
import { staffSuffix, surveyAdmin } from '@intake24/api/services/core/auth';
import { Controller, CrudActions } from '../../controller';

export type AdminSurveyController = Controller<CrudActions | 'patch' | 'put'>;

export default (): AdminSurveyController => {
  const entry = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId, {
      include: [{ model: SystemLocale }, { model: FeedbackScheme }, { model: Scheme }],
    });
    if (!survey) throw new NotFoundError();

    res.json(surveyResponse(survey));
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveysResponse>
  ): Promise<void> => {
    const permissions = (await req.scope.cradle.aclService.getPermissions()).map(
      (permission) => permission.name
    );

    const where: WhereOptions<SurveyAttributes> = {};
    if (!permissions.includes(surveyAdmin)) {
      const surveys = permissions
        .filter((permission) => permission.endsWith(staffSuffix))
        .map((permission) => permission.replace(staffSuffix, ''));

      where.id = surveys;
    }

    const surveys = await Survey.paginate<SurveyListEntry>({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'name'],
      where,
      order: [['id', 'ASC']],
      transform: surveyListResponse,
    });

    res.json(surveys);
  };

  const store = async (req: Request, res: Response<SurveyEntry>): Promise<void> => {
    const survey = await Survey.create(pick(req.body, createSurveyFields));

    res.status(201).json(surveyResponse(survey));
  };

  const read = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>
  ): Promise<void> => entry(req, res);

  const update = async (req: Request<{ surveyId: string }>, res: Response<SurveyEntry>) => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    await survey.update(pick(req.body, updateSurveyFields));

    res.json(surveyResponse(survey));
  };

  const patch = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>
    // eslint-disable-next-line consistent-return
  ): Promise<void> => {
    const { surveyId } = req.params;
    const { aclService } = req.scope.cradle;

    if (await aclService.hasPermission(surveyAdmin)) {
      return update(req, res);
    }

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    const keysToUpdate: string[] = [];

    if (await aclService.hasPermission('surveys|edit'))
      keysToUpdate.push(...staffUpdateSurveyFields);

    if (await aclService.hasPermission('surveys|overrides')) keysToUpdate.push(...overridesFields);

    if (keysToUpdate.length) await survey.update(pick(req.body, keysToUpdate));

    res.json(surveyResponse(survey));
  };

  const put = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>
  ): Promise<void> => update(req, res);

  const destroy = async (
    req: Request<{ surveyId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.scope('submissions').findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    if (survey.submissions?.length)
      throw new ForbiddenError('Survey cannot be deleted. It already contains submission data.');

    await survey.destroy();

    res.status(204).json();
  };

  const refs = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyRefs>
  ): Promise<void> => {
    const [languages, locales, schemes, feedbackSchemes] = await Promise.all([
      Language.scope('list').findAll(),
      SystemLocale.scope('list').findAll(),
      Scheme.findAll(),
      FeedbackScheme.findAll(),
    ]);

    res.json({ languages, locales, schemes, feedbackSchemes });
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    patch,
    put,
    destroy,
    refs,
  };
};
