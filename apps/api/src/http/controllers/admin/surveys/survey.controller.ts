import type { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  FeedbackScheme,
  Language,
  Op,
  PaginateQuery,
  PaginateOptions,
  securableScope,
  SystemLocale,
  Survey,
  SurveyScheme,
  UserSecurable,
} from '@intake24/db';
import type {
  SurveyEntry,
  SurveyListEntry,
  SurveyRefs,
  SurveysResponse,
} from '@intake24/common/types/http/admin';
import {
  createSurveyFields,
  guardedSurveyFields,
  overridesFields,
  updateSurveyFields,
} from '@intake24/common/types/models';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { surveyListResponse, surveyResponse } from '@intake24/api/http/responses/admin';
import { kebabCase } from '@intake24/common/util';
import type { IoC } from '@intake24/api/ioc';
import type { Controller, CrudActions } from '../../controller';
import securableController, { SecurableController } from '../securable.controller';

const actionToFieldsMap: Record<'overrides', readonly string[]> = {
  overrides: overridesFields,
};

export interface AdminSurveyController extends Controller<CrudActions | 'patch' | 'put'> {
  securables: SecurableController;
}

export const getAndCheckSurveyAccess = async (
  req: Request<{ surveyId: string }>,
  action: string,
  scope?: string | string[]
): Promise<Survey> => {
  const { surveyId } = req.params;
  const { aclService, userId } = req.scope.cradle;

  const survey = await Survey.scope(scope).findByPk(surveyId, securableScope(userId));
  if (!survey) throw new NotFoundError();

  const hasAccess = await aclService.canAccessRecord(survey, action);
  if (!hasAccess) throw new ForbiddenError();

  return survey;
};

export default (ioc: IoC): AdminSurveyController => {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveysResponse>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['slug', 'name'],
      order: [['name', 'ASC']],
      transform: surveyListResponse,
    };

    if (await aclService.hasPermission('surveys|browse')) {
      const surveys = await Survey.paginate(paginateOptions);
      res.json(surveys);
      return;
    }

    const surveys = await Survey.paginate({
      ...paginateOptions,
      where: { [Op.or]: { ownerId: userId, '$securables.action$': ['read', 'edit', 'delete'] } },
      ...securableScope(userId),
      subQuery: false,
    });

    res.json(surveys);
  };

  const store = async (req: Request, res: Response<SurveyEntry>): Promise<void> => {
    const { userId } = req.scope.cradle;

    const survey = await Survey.create({ ...pick(req.body, createSurveyFields), ownerId: userId });

    res.status(201).json(surveyResponse(survey));
  };

  const read = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>
  ): Promise<void> => {
    const survey = await getAndCheckSurveyAccess(req, 'read', [
      'locale',
      'feedbackScheme',
      'surveyScheme',
    ]);

    res.json(surveyResponse(survey));
  };

  const edit = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>
  ): Promise<void> => {
    const survey = await getAndCheckSurveyAccess(req, 'edit', [
      'locale',
      'feedbackScheme',
      'surveyScheme',
    ]);

    res.json(surveyResponse(survey));
  };

  const update = async (req: Request<{ surveyId: string }>, res: Response<SurveyEntry>) => {
    const survey = await getAndCheckSurveyAccess(req, 'edit');

    await survey.update(
      pick(req.body, [...updateSurveyFields, ...overridesFields, ...guardedSurveyFields])
    );

    res.json(surveyResponse(survey));
  };

  const patch = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const survey = await getAndCheckSurveyAccess(req, 'edit');

    const keysToUpdate: string[] = [];
    const [resourceActions, securableActions] = await Promise.all([
      aclService.getResourceAccessActions('surveys'),
      aclService.getSecurableAccessActions(survey),
    ]);

    if (resourceActions.includes('edit')) {
      keysToUpdate.push(...updateSurveyFields, ...overridesFields, ...guardedSurveyFields);
    } else if (survey.ownerId === userId) {
      keysToUpdate.push(...updateSurveyFields, ...overridesFields);
    } else {
      if (securableActions.includes('edit')) keysToUpdate.push(...updateSurveyFields);

      (Object.keys(actionToFieldsMap) as (keyof typeof actionToFieldsMap)[]).forEach((item) => {
        if (securableActions.includes(kebabCase(item)))
          keysToUpdate.push(...actionToFieldsMap[item]);
      });
    }

    const updateInput = pick(req.body, keysToUpdate);
    if (!Object.keys(updateInput).length) throw new ValidationError('Missing body');

    await survey.update(updateInput);

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
    const survey = await getAndCheckSurveyAccess(req, 'delete', 'submissions');
    const { id: securableId, submissions } = survey;

    if (!submissions || submissions.length)
      throw new ForbiddenError('Survey cannot be deleted. It already contains submission data.');

    await Promise.all([
      UserSecurable.destroy({ where: { securableId, securableType: 'Survey' } }),
      survey.destroy(),
    ]);

    res.status(204).json();
  };

  const refs = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyRefs>
  ): Promise<void> => {
    const [languages, locales, surveySchemes, feedbackSchemes] = await Promise.all([
      Language.scope('list').findAll(),
      SystemLocale.scope('list').findAll(),
      SurveyScheme.findAll({ order: [['name', 'ASC']] }),
      FeedbackScheme.findAll({ order: [['name', 'ASC']] }),
    ]);

    res.json({ languages, locales, surveySchemes, feedbackSchemes });
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
    securables: securableController({ ioc, securable: Survey }),
  };
};
