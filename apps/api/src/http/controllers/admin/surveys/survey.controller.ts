import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn, Op } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type { SurveyEntry, SurveysResponse } from '@intake24/common/types/http/admin';
import type { Job, PaginateOptions, PaginateQuery } from '@intake24/db';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { surveyListResponse, surveyResponse } from '@intake24/api/http/responses/admin';
import { jobRequiresFile, pickJobParams } from '@intake24/common/types';
import { kebabCase } from '@intake24/common/util';
import {
  createSurveyFields,
  guardedSurveyFields,
  overridesFields,
  securableIncludes,
  securableScope,
  Survey,
  updateSurveyFields,
  UserSecurable,
} from '@intake24/db';

const actionToFieldsMap: Record<'overrides', readonly string[]> = {
  overrides: overridesFields,
};

function adminSurveyController(ioc: IoC) {
  const { adminSurveyService } = ioc;

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveysResponse>,
  ): Promise<void> => {
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['slug', 'name'],
      order: [[fn('lower', col('Survey.name')), 'ASC']],
      attributes: ['id', 'localeId', 'name', 'slug', 'state', 'surveySchemeId'],
      include: [
        { association: 'locale', attributes: ['code'] },
        { association: 'surveyScheme', attributes: ['name'] },
      ],
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
      include: [
        { association: 'locale', attributes: ['code'] },
        { association: 'surveyScheme', attributes: ['name'] },
        ...securableIncludes(userId),
      ],
      subQuery: false,
    });

    res.json(surveys);
  };

  const store = async (req: Request, res: Response<SurveyEntry>): Promise<void> => {
    const { userId } = req.scope.cradle.user;

    let survey: Survey | null = await Survey.create({
      ...pick(req.body, createSurveyFields),
      ownerId: userId,
    });

    survey = await Survey.scope(['locale', 'feedbackScheme', 'surveyScheme']).findByPk(
      survey.id,
      securableScope(userId),
    );
    if (!survey)
      throw new NotFoundError();

    res.status(201).json(surveyResponse(survey));
  };

  const read = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>,
  ): Promise<void> => {
    const { surveyId } = req.params;
    const { aclService } = req.scope.cradle;

    const survey = await aclService.findAndCheckRecordAccess(Survey, 'read', {
      where: { id: surveyId },
      include: [
        { association: 'locale' },
        { association: 'feedbackScheme' },
        { association: 'surveyScheme' },
      ],
    });

    res.json(surveyResponse(survey));
  };

  const edit = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>,
  ): Promise<void> => {
    const { surveyId } = req.params;
    const { aclService } = req.scope.cradle;

    const survey = await aclService.findAndCheckRecordAccess(Survey, 'edit', {
      where: { id: surveyId },
      include: [
        { association: 'locale' },
        { association: 'feedbackScheme' },
        { association: 'surveyScheme' },
      ],
    });

    res.json(surveyResponse(survey));
  };

  const update = async (req: Request<{ surveyId: string }>, res: Response<SurveyEntry>) => {
    const { surveyId } = req.params;
    const { aclService } = req.scope.cradle;

    const survey = await aclService.findAndCheckRecordAccess(Survey, 'edit', {
      where: { id: surveyId },
      include: [
        { association: 'locale' },
        { association: 'feedbackScheme' },
        { association: 'surveyScheme' },
      ],
    });

    await survey.update(
      pick(req.body, [...updateSurveyFields, ...overridesFields, ...guardedSurveyFields]),
    );

    res.json(surveyResponse(survey));
  };

  const patch = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>,
  ): Promise<void> => {
    const { surveyId } = req.params;
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const survey = await aclService.findAndCheckRecordAccess(Survey, 'edit', {
      where: { id: surveyId },
      include: [
        { association: 'locale' },
        { association: 'feedbackScheme' },
        { association: 'surveyScheme' },
      ],
    });

    const keysToUpdate: string[] = [];
    const [resourceActions, securableActions] = await Promise.all([
      aclService.getResourceAccessActions('surveys'),
      aclService.getSecurableAccessActions(survey),
    ]);

    if (resourceActions.includes('edit')) {
      keysToUpdate.push(...updateSurveyFields, ...overridesFields, ...guardedSurveyFields);
    }
    else if (survey.ownerId === userId) {
      keysToUpdate.push(...updateSurveyFields, ...overridesFields);
    }
    else {
      if (securableActions.includes('edit'))
        keysToUpdate.push(...updateSurveyFields);

      (Object.keys(actionToFieldsMap) as (keyof typeof actionToFieldsMap)[]).forEach((item) => {
        if (securableActions.includes(kebabCase(item)))
          keysToUpdate.push(...actionToFieldsMap[item]);
      });
    }

    const updateInput = pick(req.body, keysToUpdate);
    if (!Object.keys(updateInput).length)
      throw new ValidationError('Missing body');

    await survey.update(updateInput);

    res.json(surveyResponse(survey));
  };

  const put = async (
    req: Request<{ surveyId: string }>,
    res: Response<SurveyEntry>,
  ): Promise<void> => update(req, res);

  const destroy = async (
    req: Request<{ surveyId: string }>,
    res: Response<undefined>,
  ): Promise<void> => {
    const { surveyId } = req.params;
    const { aclService } = req.scope.cradle;

    const survey = await aclService.findAndCheckRecordAccess(Survey, 'delete', {
      attributes: ['id', 'slug'],
      where: { id: surveyId },
      include: [{ association: 'submissions', attributes: ['id'] }],
    });
    const { id: securableId, submissions } = survey;

    if (!submissions || submissions.length)
      throw new ForbiddenError('Survey cannot be deleted. It already contains submission data.');

    await Promise.all([
      UserSecurable.destroy({ where: { securableId, securableType: 'Survey' } }),
      survey.destroy(),
    ]);

    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
  };

  const tasks = async (req: Request<{ surveyId: string }>, res: Response<Job>): Promise<void> => {
    const {
      body: { type },
      file,
      params: { surveyId },
    } = req;
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(Survey, 'tasks', {
      attributes: ['id'],
      where: { id: surveyId },
    });

    const params = { ...pickJobParams(req.body.params, type), surveyId };

    if (jobRequiresFile(type)) {
      if (!file)
        throw new ValidationError('Missing file.', { path: 'params.file' });

      params.file = file.path;
    }

    const job = await adminSurveyService.queueTask({ userId, type, params });

    res.json(job);
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
    tasks,
  };
}

export default adminSurveyController;

export type AdminSurveyController = ReturnType<typeof adminSurveyController>;
