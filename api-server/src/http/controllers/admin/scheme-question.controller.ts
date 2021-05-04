import { Request, Response } from 'express';
import { pick } from 'lodash';
import { Language, Scheme, SchemeQuestion } from '@/db/models/system';
import { NotFoundError } from '@/http/errors';
import {
  CreateSchemeQuestionResponse,
  StoreSchemeQuestionResponse,
  SchemeQuestionRefs,
  SchemeQuestionResponse,
  SchemeQuestionsResponse,
} from '@common/types/http/admin';
import { Controller, CrudActions } from '../controller';

export type SchemeQuestionController = Controller<CrudActions>;

export default (): SchemeQuestionController => {
  const refs = async (): Promise<SchemeQuestionRefs> => {
    const languages = await Language.findAll();
    const schemes = await Scheme.findAll();

    return { languages, schemes };
  };

  const entry = async (req: Request, res: Response<SchemeQuestionResponse>): Promise<void> => {
    const { schemeQuestionId } = req.params;
    const schemeQuestion = await SchemeQuestion.findByPk(schemeQuestionId);

    if (!schemeQuestion) throw new NotFoundError();

    res.json({ data: schemeQuestion, refs: await refs() });
  };

  const browse = async (req: Request, res: Response<SchemeQuestionsResponse>): Promise<void> => {
    const schemeQuestions = await SchemeQuestion.paginate({
      req,
      columns: ['name'],
      order: [['name', 'ASC']],
    });

    res.json(schemeQuestions);
  };

  const create = async (
    req: Request,
    res: Response<CreateSchemeQuestionResponse>
  ): Promise<void> => {
    res.json({ refs: await refs() });
  };

  const store = async (req: Request, res: Response<StoreSchemeQuestionResponse>): Promise<void> => {
    const schemeQuestion = await SchemeQuestion.create(pick(req.body, ['name', 'prompt']));

    res.status(201).json({ data: schemeQuestion });
  };

  const detail = async (req: Request, res: Response<SchemeQuestionResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<SchemeQuestionResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<SchemeQuestionResponse>): Promise<void> => {
    const { schemeQuestionId } = req.params;

    const schemeQuestion = await SchemeQuestion.findByPk(schemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    await schemeQuestion.update(pick(req.body, ['name', 'prompt']));

    res.json({ data: schemeQuestion, refs: await refs() });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { schemeQuestionId } = req.params;

    const schemeQuestion = await SchemeQuestion.scope('surveys').findByPk(schemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    await schemeQuestion.destroy();
    res.status(204).json();
  };

  return {
    browse,
    create,
    store,
    detail,
    edit,
    update,
    destroy,
  };
};
