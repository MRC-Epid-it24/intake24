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
import {
  createSurveyFields,
  overridesFields,
  staffUpdateSurveyFields,
  updateSurveyFields,
  SurveyAttributes,
} from '@common/types/models';
import { Language, Locale, Scheme, Survey } from '@api/db/models/system';
import { ForbiddenError, NotFoundError } from '@api/http/errors';
import { surveyListResponse, surveyResponse } from '@api/http/responses/admin';
import { staffSuffix, surveyAdmin } from '@api/services/core/auth';
import { PaginateQuery } from '@api/db/models/model';
import { Controller, CrudActions } from '../../controller';

export type AdminSurveyController = Controller<CrudActions | 'patch' | 'put'>;

export default (): AdminSurveyController => {
  const refs = async (): Promise<SurveyRefs> => {
    const [languages, locales, schemes] = await Promise.all([
      Language.findAll(),
      Locale.findAll(),
      Scheme.findAll(),
    ]);

    return { languages, locales, schemes };
  };

  const entry = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyResponse>
  ): Promise<void> => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    res.json({ data: surveyResponse(survey), refs: await refs() });
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

  const create = async (req: Request, res: Response<CreateSurveyResponse>): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (req: Request, res: Response<StoreSurveyResponse>): Promise<void> => {
    const survey = await Survey.create(pick(req.body, createSurveyFields));

    res.status(201).json({ data: surveyResponse(survey) });
  };

  const read = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyResponse>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyResponse>
  ): Promise<void> => entry(req, res);

  const update = async (req: Request<{ surveyId: string }>, res: Response<SurveyResponse>) => {
    const { surveyId } = req.params;

    const survey = await Survey.findByPk(surveyId);
    if (!survey) throw new NotFoundError();

    await survey.update(pick(req.body, updateSurveyFields));

    res.json({ data: surveyResponse(survey), refs: await refs() });
  };

  const patch = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyResponse>
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

    if (await aclService.hasPermission('surveys-edit'))
      keysToUpdate.push(...staffUpdateSurveyFields);

    if (await aclService.hasPermission('surveys-overrides')) keysToUpdate.push(...overridesFields);

    if (keysToUpdate.length) await survey.update(pick(req.body, keysToUpdate));

    res.json({ data: surveyResponse(survey), refs: await refs() });
  };

  const put = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyResponse>
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

  return {
    browse,
    create,
    store,
    read,
    edit,
    update,
    patch,
    put,
    destroy,
  };
};
