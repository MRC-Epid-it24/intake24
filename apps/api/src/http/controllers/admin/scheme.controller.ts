import { Request, Response } from 'express';
import { pick } from 'lodash';
import { FindOptions, Op } from 'sequelize';
import {
  SchemeEntry,
  SchemeRefs,
  SchemesResponse,
  SchemeExportRefsResponse,
} from '@common/types/http/admin';
import { ExportField, ExportSectionId } from '@common/types/models';
import type { IoC } from '@api/ioc';
import { ForbiddenError, NotFoundError } from '@api/http/errors';
import { Language, Scheme, SchemeQuestion, PaginateQuery } from '@api/db';
import { PromptQuestion } from '@common/prompts';
import { Controller, CrudActions } from '../controller';

export type SchemeController = Controller<CrudActions | 'copy' | 'templates' | 'dataExportRefs'>;

export default ({ dataExportFields }: Pick<IoC, 'dataExportFields'>): SchemeController => {
  const entry = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeEntry>
  ): Promise<void> => {
    const { schemeId } = req.params;

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    res.json(scheme);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SchemesResponse>
  ): Promise<void> => {
    const schemes = await Scheme.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'name'],
      order: [['id', 'ASC']],
    });

    res.json(schemes);
  };

  const store = async (req: Request, res: Response<SchemeEntry>): Promise<void> => {
    const scheme = await Scheme.create(
      pick(req.body, ['id', 'name', 'type', 'questions', 'meals', 'export'])
    );

    res.status(201).json(scheme);
  };

  const read = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeEntry>
  ): Promise<void> => {
    const { schemeId } = req.params;

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    await scheme.update(pick(req.body, ['name', 'type', 'questions', 'meals', 'export']));

    res.json(scheme);
  };

  const destroy = async (
    req: Request<{ schemeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { schemeId } = req.params;

    const scheme = await Scheme.scope('surveys').findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    if (scheme.surveys?.length)
      throw new ForbiddenError('Scheme cannot be deleted. There are surveys using this scheme.');

    await scheme.destroy();
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<SchemeRefs>): Promise<void> => {
    const languages = await Language.scope('list').findAll();
    const questions = await SchemeQuestion.findAll({ attributes: ['question'] });
    const templates = questions.map((schemeQuestion) => schemeQuestion.question);

    res.json({ languages, templates });
  };

  const copy = async (req: Request, res: Response<SchemeEntry>): Promise<void> => {
    const { sourceId, id, name } = req.body;

    const sourceScheme = await Scheme.findByPk(sourceId);
    if (!sourceScheme) throw new NotFoundError();

    const scheme = await Scheme.create({ ...sourceScheme.get(), id, name });

    res.json(scheme);
  };

  const templates = async (
    req: Request<{ schemeId: string }, any, any, { search?: string; limit?: number }>,
    res: Response<PromptQuestion[]>
  ): Promise<void> => {
    const {
      params: { schemeId },
      query: { search, limit },
    } = req;

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    const options: FindOptions = { limit };

    if (search) {
      const op =
        SchemeQuestion.sequelize?.getDialect() === 'postgres'
          ? { [Op.iLike]: `%${search}%` }
          : { [Op.substring]: search };

      const ops = ['questionId', 'name'].map((column) => ({ [column]: op }));
      options.where = { [Op.or]: ops };
    }

    const schemeQuestions = await SchemeQuestion.findAll(options);
    const questions = schemeQuestions.map((schemeQuestion) => schemeQuestion.question);

    res.json(questions);
  };

  const dataExportRefs = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeExportRefsResponse>
  ): Promise<void> => {
    const { schemeId } = req.params;

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    const fieldMapper = ({ id, label }: ExportField) => ({ id, label });

    const fields: any = {};
    for (const [section, callback] of Object.entries(dataExportFields)) {
      const sectionFields = await callback(scheme);
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
