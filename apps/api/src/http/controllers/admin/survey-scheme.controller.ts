import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  FindOptions,
  Op,
  Language,
  SurveyScheme,
  SurveySchemeQuestion,
  PaginateQuery,
} from '@intake24/db';
import {
  SurveySchemeEntry,
  SurveySchemeRefs,
  SurveySchemesResponse,
  SurveySchemeExportRefsResponse,
} from '@intake24/common/types/http/admin';
import {
  ExportField,
  ExportSectionId,
  SurveySchemeCreationAttributes,
} from '@intake24/common/types/models';
import type { IoC } from '@intake24/api/ioc';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { PromptQuestion } from '@intake24/common/prompts';
import { Controller, CrudActions } from '../controller';

export type SurveySchemeController = Controller<
  CrudActions | 'copy' | 'templates' | 'dataExportRefs'
>;

export default ({ dataExportFields }: Pick<IoC, 'dataExportFields'>): SurveySchemeController => {
  const entry = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const { surveySchemeId } = req.params;

    const surveyScheme = await SurveyScheme.findByPk(surveySchemeId);
    if (!surveyScheme) throw new NotFoundError();

    res.json(surveyScheme);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemesResponse>
  ): Promise<void> => {
    const surveySchemes = await SurveyScheme.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [['name', 'ASC']],
    });

    res.json(surveySchemes);
  };

  const store = async (
    req: Request<any, any, SurveySchemeCreationAttributes>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const surveyScheme = await SurveyScheme.create(
      pick(req.body, ['name', 'type', 'questions', 'meals', 'dataExport'])
    );

    res.status(201).json(surveyScheme);
  };

  const read = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<SurveySchemeEntry>
  ): Promise<void> => {
    const { surveySchemeId } = req.params;

    const surveyScheme = await SurveyScheme.findByPk(surveySchemeId);
    if (!surveyScheme) throw new NotFoundError();

    await surveyScheme.update(pick(req.body, ['name', 'type', 'questions', 'meals', 'dataExport']));

    res.json(surveyScheme);
  };

  const destroy = async (
    req: Request<{ surveySchemeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { surveySchemeId } = req.params;

    const surveyScheme = await SurveyScheme.scope('surveys').findByPk(surveySchemeId);
    if (!surveyScheme) throw new NotFoundError();

    if (surveyScheme.surveys?.length)
      throw new ForbiddenError('Scheme cannot be deleted. There are surveys using this scheme.');

    await surveyScheme.destroy();
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<SurveySchemeRefs>): Promise<void> => {
    const languages = await Language.scope('list').findAll();
    const questions = await SurveySchemeQuestion.findAll({ attributes: ['question'] });
    const templates = questions.map((schemeQuestion) => schemeQuestion.question);

    res.json({ languages, templates });
  };

  const copy = async (req: Request, res: Response<SurveySchemeEntry>): Promise<void> => {
    const { sourceId, name } = req.body;

    const sourceSurveyScheme = await SurveyScheme.findByPk(sourceId);
    if (!sourceSurveyScheme) throw new NotFoundError();

    const { type, questions, meals, dataExport } = sourceSurveyScheme;

    const surveyScheme = await SurveyScheme.create({ name, type, questions, meals, dataExport });

    res.json(surveyScheme);
  };

  const templates = async (
    req: Request<{ surveySchemeId: string }, any, any, { search?: string; limit?: number }>,
    res: Response<PromptQuestion[]>
  ): Promise<void> => {
    const {
      params: { surveySchemeId },
      query: { search, limit },
    } = req;

    const surveyScheme = await SurveyScheme.findByPk(surveySchemeId);
    if (!surveyScheme) throw new NotFoundError();

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

    const surveyScheme = await SurveyScheme.findByPk(surveySchemeId);
    if (!surveyScheme) throw new NotFoundError();

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
    destroy,
    refs,
    copy,
    templates,
    dataExportRefs,
  };
};
