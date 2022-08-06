import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { PromptQuestion } from '@intake24/common/prompts';
import type { ExportField, ExportSectionId } from '@intake24/common/schemes';
import type {
  SurveySchemeEntry,
  SurveySchemeExportRefsResponse,
  SurveySchemeRefs,
  SurveySchemesResponse,
} from '@intake24/common/types/http/admin';
import type { SurveySchemeCreationAttributes } from '@intake24/common/types/models';
import type { FindOptions, PaginateOptions, PaginateQuery } from '@intake24/db';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import {
  createSurveySchemeFields,
  perCardSurveySchemeFields,
  updateSurveySchemeFields,
} from '@intake24/common/types/models';
import { kebabCase } from '@intake24/common/util';
import {
  Language,
  Op,
  securableScope,
  SurveyScheme,
  SurveySchemeQuestion,
  UserSecurable,
} from '@intake24/db';

import securableController from './securable.controller';

const surveySchemeController = (ioc: IoC) => {
  const { dataExportFields } = ioc;

  const getAndCheckAccess = async (
    req: Request<{ surveySchemeId: string }>,
    action: string,
    scope?: string
  ): Promise<SurveyScheme> => {
    const { surveySchemeId } = req.params;
    const { aclService, userId } = req.scope.cradle;

    const surveyScheme = await SurveyScheme.scope(scope).findByPk(
      surveySchemeId,
      securableScope(userId)
    );
    if (!surveyScheme) throw new NotFoundError();

    const hasAccess = await aclService.canAccessRecord(surveyScheme, action);
    if (!hasAccess) throw new ForbiddenError();

    return surveyScheme;
  };

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

    res.status(201).json(surveyScheme);
  };

  const read = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(req, 'read');

    res.json(surveyScheme);
  };

  const edit = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(req, 'edit');

    res.json(surveyScheme);
  };

  const update = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(req, 'edit');

    await surveyScheme.update(pick(req.body, createSurveySchemeFields));

    res.json(surveyScheme);
  };

  const patch = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const surveyScheme = await getAndCheckAccess(req, 'edit');

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

    res.json(surveyScheme);
  };

  const put = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => update(req, res);

  const destroy = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const surveyScheme = await getAndCheckAccess(req, 'delete', 'surveys');
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
    const surveyScheme = await getAndCheckAccess(req, 'copy');

    const { name } = req.body;
    const { userId } = req.scope.cradle;
    const { type, questions, meals, dataExport } = surveyScheme;

    const surveySchemeCopy = await SurveyScheme.create({
      name,
      type,
      questions,
      meals,
      dataExport,
      ownerId: userId,
    });

    res.json(surveySchemeCopy);
  };

  const refs = async (req: Request, res: Response<SurveySchemeRefs>): Promise<void> => {
    const [languages, questions] = await Promise.all([
      Language.scope('list').findAll(),
      SurveySchemeQuestion.findAll({ attributes: ['question'] }),
    ]);

    const templates = questions.map((schemeQuestion) => schemeQuestion.question);

    res.json({ languages, templates });
  };

  const templates = async (
    req: Request<{ surveySchemeId: string }, any, any, { search?: string; limit?: number }>,
    res: Response<PromptQuestion[]>
  ): Promise<void> => {
    const {
      params: { surveySchemeId },
      query: { search, limit },
    } = req;
    const { aclService, userId } = req.scope.cradle;

    const surveyScheme = await SurveyScheme.findByPk(surveySchemeId, securableScope(userId));
    if (!surveyScheme) throw new NotFoundError();

    const hasAccess = await aclService.canAccessRecord(surveyScheme, 'questions');
    if (!hasAccess) throw new ForbiddenError();

    const options: FindOptions = { limit };

    if (search) {
      const op =
        SurveySchemeQuestion.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['questionId', 'name'].map((column) => ({ [column]: op }));
      options.where = { [Op.or]: ops };
    }

    const surveySchemeQuestions = await SurveySchemeQuestion.findAll(options);
    const questions = surveySchemeQuestions.map((schemeQuestion) => schemeQuestion.question);

    res.json(questions);
  };

  const dataExportRefs = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeExportRefsResponse>
  ): Promise<void> => {
    const { surveySchemeId } = req.params;
    const { aclService, userId } = req.scope.cradle;

    const surveyScheme = await SurveyScheme.findByPk(surveySchemeId, securableScope(userId));
    if (!surveyScheme) throw new NotFoundError();

    const hasAccess = await aclService.canAccessRecord(surveyScheme, 'data-export');
    if (!hasAccess) throw new ForbiddenError();

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
