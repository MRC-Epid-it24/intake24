import { Request, Response } from 'express';
import {
  SchemeQuestionEntry,
  SchemeQuestionRefs,
  SchemeQuestionsResponse,
} from '@intake24/common/types/http/admin';
import { isMealSection, MealSection, SurveyQuestionSection } from '@intake24/common/schemes';
import { Language, Scheme, SchemeQuestion, PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { pick } from 'lodash';
import { Controller, CrudActions } from '../controller';

export type SchemeQuestionController = Controller<CrudActions | 'sync'>;

export default (): SchemeQuestionController => {
  const entry = async (
    req: Request<{ schemeQuestionId: string }>,
    res: Response<SchemeQuestionEntry>
  ): Promise<void> => {
    const { schemeQuestionId } = req.params;

    const schemeQuestion = await SchemeQuestion.findByPk(schemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    res.json(schemeQuestion);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SchemeQuestionsResponse>
  ): Promise<void> => {
    const schemeQuestions = await SchemeQuestion.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['questionId', 'name'],
      order: [['questionId', 'ASC']],
    });

    res.json(schemeQuestions);
  };

  const store = async (req: Request, res: Response<SchemeQuestionEntry>): Promise<void> => {
    const { question } = req.body;
    const { id: questionId, name } = question;

    const schemeQuestion = await SchemeQuestion.create({ questionId, name, question });

    res.status(201).json(schemeQuestion);
  };

  const read = async (
    req: Request<{ schemeQuestionId: string }>,
    res: Response<SchemeQuestionEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ schemeQuestionId: string }>,
    res: Response<SchemeQuestionEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ schemeQuestionId: string }>,
    res: Response<SchemeQuestionEntry>
  ): Promise<void> => {
    const {
      params: { schemeQuestionId },
      body: { question },
    } = req;
    const { id: questionId, name } = question;

    const schemeQuestion = await SchemeQuestion.findByPk(schemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    await schemeQuestion.update({ questionId, name, question });

    res.json(schemeQuestion);
  };

  const destroy = async (
    req: Request<{ schemeQuestionId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { schemeQuestionId } = req.params;

    const schemeQuestion = await SchemeQuestion.findByPk(schemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    await schemeQuestion.destroy();
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<SchemeQuestionRefs>): Promise<void> => {
    const [languages, schemes, questions] = await Promise.all([
      Language.scope('list').findAll(),
      Scheme.findAll(),
      SchemeQuestion.findAll({ attributes: ['question'] }),
    ]);

    const questionIds = questions.map((q) => q.question.id);

    res.json({ languages, schemes, questionIds });
  };

  const sync = async (
    req: Request<{ schemeQuestionId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      params: { schemeQuestionId },
      body: { schemeId, question },
    } = req;
    const section = req.body.section as SurveyQuestionSection | MealSection;

    const schemeQuestion = await SchemeQuestion.findByPk(schemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    const scheme = await Scheme.findByPk(schemeId);
    if (!scheme) throw new NotFoundError();

    const { questions } = scheme;
    const sectionQuestions = isMealSection(section) ? questions.meals[section] : questions[section];

    const match = sectionQuestions.findIndex((q) => q.id === question.id);
    if (match === -1) throw new NotFoundError();

    sectionQuestions.splice(match, 1, question);

    if (isMealSection(section)) questions.meals[section] = sectionQuestions;
    else questions[section] = sectionQuestions;

    await scheme.update({ questions });

    res.json();
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    sync,
  };
};
