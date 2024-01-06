import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn } from 'sequelize';

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

import { securableController } from './securable.controller';

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
      order: [[fn('lower', col('SurveyScheme.name')), 'ASC']],
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
    const { surveySchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'read', {
      where: { id: surveySchemeId },
    });

    res.json(surveySchemeResponse(surveyScheme));
  };

  const edit = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const { surveySchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'edit', {
      where: { id: surveySchemeId },
    });

    res.json(surveySchemeResponse(surveyScheme));
  };

  const update = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const { surveySchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'edit', {
      where: { id: surveySchemeId },
    });

    await surveyScheme.update(pick(req.body, createSurveySchemeFields));

    res.json(surveySchemeResponse(surveyScheme));
  };

  const patch = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const { surveySchemeId } = req.params;
    const { aclService, userId } = req.scope.cradle;

    const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'edit', {
      where: { id: surveySchemeId },
    });

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
    const { surveySchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'delete', {
      attributes: ['id'],
      where: { id: surveySchemeId },
      include: [{ association: 'surveys', attributes: ['id'] }],
    });
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
    const { surveySchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'copy', {
      where: { id: surveySchemeId },
    });

    const { name } = req.body;
    const { userId } = req.scope.cradle;
    const { type, visibility, prompts, meals, dataExport } = surveyScheme;

    const surveySchemeCopy = await SurveyScheme.create({
      name,
      type,
      visibility,
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
    const { surveySchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    await aclService.findAndCheckRecordAccess(SurveyScheme, 'prompts', {
      attributes: ['id'],
      where: { id: surveySchemeId },
    });

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
    const { surveySchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const surveyScheme = await aclService.findAndCheckRecordAccess(SurveyScheme, 'data-export', {
      attributes: ['id', 'prompts'],
      where: { id: surveySchemeId },
    });

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
