import type { Request, Response } from 'express';
import type {
  SurveySchemeQuestionEntry,
  SurveySchemeQuestionRefs,
  SurveySchemeQuestionsResponse,
} from '@intake24/common/types/http/admin';
import type { MealSection, SurveyQuestionSection } from '@intake24/common/schemes';
import { isMealSection } from '@intake24/common/schemes';
import type { PaginateQuery } from '@intake24/db';
import { Language, SurveyScheme, SurveySchemeQuestion } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import { pick } from 'lodash';

const surveySchemeQuestionController = () => {
  const entry = async (
    req: Request<{ surveySchemeQuestionId: string }>,
    res: Response<SurveySchemeQuestionEntry>
  ): Promise<void> => {
    const { surveySchemeQuestionId } = req.params;

    const schemeQuestion = await SurveySchemeQuestion.findByPk(surveySchemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    res.json(schemeQuestion);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<SurveySchemeQuestionsResponse>
  ): Promise<void> => {
    const schemeQuestions = await SurveySchemeQuestion.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['questionId', 'name'],
      order: [['questionId', 'ASC']],
    });

    res.json(schemeQuestions);
  };

  const store = async (req: Request, res: Response<SurveySchemeQuestionEntry>): Promise<void> => {
    const { question } = req.body;
    const { id: questionId, name } = question;

    const schemeQuestion = await SurveySchemeQuestion.create({ questionId, name, question });

    res.status(201).json(schemeQuestion);
  };

  const read = async (
    req: Request<{ surveySchemeQuestionId: string }>,
    res: Response<SurveySchemeQuestionEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ surveySchemeQuestionId: string }>,
    res: Response<SurveySchemeQuestionEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ surveySchemeQuestionId: string }>,
    res: Response<SurveySchemeQuestionEntry>
  ): Promise<void> => {
    const {
      params: { surveySchemeQuestionId },
      body: { question },
    } = req;
    const { id: questionId, name } = question;

    const schemeQuestion = await SurveySchemeQuestion.findByPk(surveySchemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    await schemeQuestion.update({ questionId, name, question });

    res.json(schemeQuestion);
  };

  const destroy = async (
    req: Request<{ surveySchemeQuestionId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { surveySchemeQuestionId } = req.params;

    const schemeQuestion = await SurveySchemeQuestion.findByPk(surveySchemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    await schemeQuestion.destroy();
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<SurveySchemeQuestionRefs>): Promise<void> => {
    const [languages, schemes, questions] = await Promise.all([
      Language.scope('list').findAll(),
      SurveyScheme.findAll(),
      SurveySchemeQuestion.findAll({ attributes: ['question'] }),
    ]);

    const questionIds = questions.map((q) => q.question.id);

    res.json({ languages, schemes, questionIds });
  };

  const sync = async (
    req: Request<{ surveySchemeQuestionId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const {
      params: { surveySchemeQuestionId },
      body: { surveySchemeId, question },
    } = req;
    const section = req.body.section as SurveyQuestionSection | MealSection;

    const schemeQuestion = await SurveySchemeQuestion.findByPk(surveySchemeQuestionId);
    if (!schemeQuestion) throw new NotFoundError();

    const scheme = await SurveyScheme.findByPk(surveySchemeId);
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

export default surveySchemeQuestionController;

export type SurveySchemeQuestionController = ReturnType<typeof surveySchemeQuestionController>;
