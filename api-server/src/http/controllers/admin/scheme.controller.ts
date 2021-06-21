import { Request, Response } from 'express';
import { pick } from 'lodash';
import { FindOptions, Op } from 'sequelize';
import { Language, Scheme, SchemeQuestion } from '@/db/models/system';
import { defaultMeals, flattenScheme } from '@common/schemes';
import { ForbiddenError, NotFoundError } from '@/http/errors';
import type { IoC } from '@/ioc';
import {
  CreateSchemeResponse,
  SchemeRefs,
  SchemeResponse,
  SchemesResponse,
  CopySchemeResponse,
  StoreSchemeResponse,
  SchemeExportRefsResponse,
  SchemeQuestionTemplatesResponse,
} from '@common/types/http/admin';
import { ExportField, ExportSectionId } from '@common/types/models';
import { RecallQuestions } from '@common/types';
import { PromptQuestion } from '@common/prompts';
import { Controller, CrudActions } from '../controller';

export type SchemeController = Controller<CrudActions | 'copy' | 'templates' | 'dataExportRefs'>;

export default ({ dataExportFields }: Pick<IoC, 'dataExportFields'>): SchemeController => {
  const refs = async (recallQuestions?: RecallQuestions): Promise<SchemeRefs> => {
    const languages = await Language.findAll();

    let templates: PromptQuestion[] = [];

    if (recallQuestions) {
      const questionId = flattenScheme(recallQuestions).map((question) => question.id);
      const questions = await SchemeQuestion.findAll({ where: { questionId } });
      templates = questions.map((schemeQuestion) => schemeQuestion.question);
    }

    return { languages, meals: defaultMeals, templates };
  };

  const entry = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeResponse>
  ): Promise<void> => {
    const { schemeId } = req.params;

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    res.json({ data: scheme, refs: await refs(scheme.questions) });
  };

  const browse = async (req: Request, res: Response<SchemesResponse>): Promise<void> => {
    const schemes = await Scheme.paginate({
      req,
      columns: ['id', 'name'],
      order: [['id', 'ASC']],
    });

    res.json(schemes);
  };

  const create = async (req: Request, res: Response<CreateSchemeResponse>): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (req: Request, res: Response<StoreSchemeResponse>): Promise<void> => {
    const scheme = await Scheme.create(
      pick(req.body, ['id', 'name', 'type', 'questions', 'meals', 'export'])
    );

    res.status(201).json({ data: scheme });
  };

  const detail = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeResponse>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeResponse>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ schemeId: string }>,
    res: Response<SchemeResponse>
  ): Promise<void> => {
    const { schemeId } = req.params;

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    await scheme.update(pick(req.body, ['name', 'type', 'questions', 'meals', 'export']));

    res.json({ data: scheme, refs: await refs(scheme.questions) });
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

  const copy = async (req: Request, res: Response<CopySchemeResponse>): Promise<void> => {
    const { originalId, id, name } = req.body;

    const originalScheme = await Scheme.findByPk(originalId);
    if (!originalScheme) throw new NotFoundError();

    const schemeAttributes = originalScheme.get();
    const scheme = await Scheme.create({ ...schemeAttributes, id, name });

    res.json({ data: scheme });
  };

  const templates = async (
    req: Request<{ schemeId: string }, any, any, { search?: string; limit?: number }>,
    res: Response<SchemeQuestionTemplatesResponse>
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

    res.json({ data: questions });
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
    create,
    store,
    detail,
    edit,
    update,
    destroy,
    copy,
    templates,
    dataExportRefs,
  };
};
