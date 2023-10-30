import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { ExportField, ExportSectionId } from '@intake24/common/surveys';
import type {
  SurveySchemeEntry,
  SurveySchemeExportRefsResponse,
  SurveySchemeRefs,
  SurveySchemesResponse,
  SurveySchemeTemplates,
} from '@intake24/common/types/http/admin';
import type { PaginateOptions, PaginateQuery, SurveySchemeCreationAttributes } from '@intake24/db';
import { ForbiddenError, ValidationError } from '@intake24/api/http/errors';
import { surveySchemeResponse } from '@intake24/api/http/responses/admin';
import { kebabCase } from '@intake24/common/util';
import {
  createSurveySchemeFields,
  Op,
  perCardSurveySchemeFields,
  securableScope,
  SurveyScheme,
  SurveySchemePrompt,
  updateSurveySchemeFields,
  UserSecurable,
} from '@intake24/db';

import { getAndCheckAccess, securableController } from './securable.controller';

const surveySchemeController = (ioc: IoC) => {
  const { dataExportFields } = ioc;

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemesResponse>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [['name', 'ASC']],
    };

    if (await aclService.hasPermission('survey-schemes|browse')) {
      const surveySchemes = await SurveyScheme.paginate(paginateOptions);
      res.json(surveySchemes);
      return;
    }

    const surveySchemes = await SurveyScheme.paginate({
      ...paginateOptions,
      where: { [Op.or]: { ownerId: userId, '$securables.action$': ['read', 'edit', 'delete'] } },
      ...securableScope(userId),
      subQuery: false,
    });

    res.json(surveySchemes);
  };

  const store = async (
    req: Request<any, any, SurveySchemeCreationAttributes>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const { userId } = req.scope.cradle;

    const surveyScheme = await SurveyScheme.create({
      ...pick(req.body, createSurveySchemeFields),
      ownerId: userId,
    });

    res.status(201).json(surveySchemeResponse(surveyScheme));
  };

  const read = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(SurveyScheme, 'read', req);

    res.json(surveySchemeResponse(surveyScheme));
  };

  const edit = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(SurveyScheme, 'edit', req);

    res.json(surveySchemeResponse(surveyScheme));
  };

  const update = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(SurveyScheme, 'edit', req);

    await surveyScheme.update(pick(req.body, createSurveySchemeFields));

    res.json(surveySchemeResponse(surveyScheme));
  };

  const patch = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const surveyScheme = await getAndCheckAccess(SurveyScheme, 'edit', req);

    const keysToUpdate: string[] = [];
    const [resourceActions, securableActions] = await Promise.all([
      aclService.getResourceAccessActions('survey-schemes'),
      aclService.getSecurableAccessActions(surveyScheme),
    ]);

    if (resourceActions.includes('edit') || surveyScheme.ownerId === userId) {
      keysToUpdate.push(...createSurveySchemeFields);
    } else {
      if (securableActions.includes('edit')) keysToUpdate.push(...updateSurveySchemeFields);

      perCardSurveySchemeFields.forEach((item) => {
        if (securableActions.includes(kebabCase(item))) keysToUpdate.push(item);
      });
    }

    const updateInput = pick(req.body, keysToUpdate);
    if (!Object.keys(updateInput).length) throw new ValidationError('Missing body');

    await surveyScheme.update(updateInput);

    res.json(surveySchemeResponse(surveyScheme));
  };

  const put = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => update(req, res);

  const destroy = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(SurveyScheme, 'delete', req, 'surveys');
    const { id: securableId, surveys } = surveyScheme;

    if (!surveys || surveys.length)
      throw new ForbiddenError('Scheme cannot be deleted. There are surveys using this scheme.');

    await Promise.all([
      UserSecurable.destroy({ where: { securableId, securableType: 'SurveyScheme' } }),
      surveyScheme.destroy(),
    ]);

    res.status(204).json();
  };

  const copy = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(SurveyScheme, 'copy', req);

    const { name } = req.body;
    const { userId } = req.scope.cradle;
    const { type, prompts, meals, dataExport } = surveyScheme;

    const surveySchemeCopy = await SurveyScheme.create({
      name,
      type,
      prompts,
      meals,
      dataExport,
      ownerId: userId,
    });

    res.json(surveySchemeResponse(surveySchemeCopy));
  };

  const refs = async (req: Request, res: Response<SurveySchemeRefs>): Promise<void> => {
    const prompts = await SurveySchemePrompt.findAll({ attributes: ['prompt'] });

    const templates = prompts.map(({ prompt }) => prompt);

    res.json({ templates });
  };

  const templates = async (
    req: Request<{ surveySchemeId: string }, any, any, PaginateQuery>,
    res: Response<SurveySchemeTemplates>
  ): Promise<void> => {
    await getAndCheckAccess(SurveyScheme, 'prompts', req as Request<{ surveySchemeId: string }>);

    const surveySchemePrompts = await SurveySchemePrompt.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name', 'promptId'],
      order: [['promptId', 'ASC']],
      transform: ({ prompt }) => prompt,
    });

    res.json(surveySchemePrompts);
  };

  const dataExportRefs = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeExportRefsResponse>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(SurveyScheme, 'data-export', req);

    const fieldMapper = ({ id, label }: ExportField) => ({ id, label });

    const fields: any = {};
    for (const [section, callback] of Object.entries(dataExportFields)) {
      const sectionFields = await callback(surveyScheme);
      fields[section as ExportSectionId] = sectionFields.map(fieldMapper);
    }

    res.json(fields);
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
    copy,
    refs,
    templates,
    dataExportRefs,
    securables: securableController({ ioc, securable: SurveyScheme }),
  };
};

export default surveySchemeController;

export type SurveySchemeController = ReturnType<typeof surveySchemeController>;
