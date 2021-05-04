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
import { isMealSection } from '@common/schemes';
import { MealSection, SurveyQuestionSection } from '@common/types';
import { Controller, CrudActions } from '../controller';

export type SchemeQuestionController = Controller<CrudActions | 'sync'>;

export default (): SchemeQuestionController => {
  const refs = async (): Promise<SchemeQuestionRefs> => {
    const languages = await Language.findAll();
    const schemes = await Scheme.findAll();
    const questions = await SchemeQuestion.findAll();

    const questionIds = questions.map((question) => question.prompt.id);

    return { languages, schemes, questionIds };
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

  const sync = async (req: Request, res: Response<SchemeQuestionResponse>): Promise<void> => {
    const { schemeQuestionId } = req.params;
    const { schemeId, prompt } = req.body;
    const section = req.body.section as SurveyQuestionSection | MealSection;

    const schemeQuestion = await SchemeQuestion.findByPk(schemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    const { questions } = scheme;
    const sectionQuestions = isMealSection(section) ? questions.meals[section] : questions[section];

    const match = sectionQuestions.findIndex((question) => question.id === prompt.id);
    if (match === -1) throw new NotFoundError();

    sectionQuestions.splice(match, 1, prompt);

    if (isMealSection(section)) questions.meals[section] = sectionQuestions;
    else questions.preMeals = sectionQuestions;

    scheme.questions = questions;
    await scheme.save();

    res.json();
  };

  return {
    browse,
    create,
    store,
    detail,
    edit,
    update,
    sync,
    destroy,
  };
};
