import { Request, Response } from 'express';
import { pick } from 'lodash';
import { PaginateQuery, FeedbackScheme, SystemNutrientType, Language } from '@intake24/db';
import {
  FeedbackSchemeEntry,
  FeedbackSchemesResponse,
  FeedbackSchemeRefs,
} from '@intake24/common/types/http/admin';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { Controller, CrudActions } from '../controller';

export type FeedbackSchemeController = Controller<CrudActions | 'copy'>;

export default (): FeedbackSchemeController => {
  const entry = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;

    const feedbackScheme = await FeedbackScheme.findByPk(feedbackSchemeId);
    if (!feedbackScheme) throw new NotFoundError();

    res.json(feedbackScheme);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FeedbackSchemesResponse>
  ): Promise<void> => {
    const feedbackSchemes = await FeedbackScheme.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'name'],
      order: [['name', 'ASC']],
    });

    res.json(feedbackSchemes);
  };

  const store = async (req: Request, res: Response<FeedbackSchemeEntry>): Promise<void> => {
    const feedbackScheme = await FeedbackScheme.create(
      pick(req.body, ['name', 'type', 'topFoods', 'foodGroups', 'henryCoefficients'])
    );

    res.status(201).json(feedbackScheme);
  };

  const read = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;

    const feedbackScheme = await FeedbackScheme.findByPk(feedbackSchemeId);
    if (!feedbackScheme) throw new NotFoundError();

    await feedbackScheme.update(
      pick(req.body, ['name', 'type', 'topFoods', 'foodGroups', 'henryCoefficients'])
    );

    res.json(feedbackScheme);
  };

  const destroy = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;

    const feedbackScheme = await FeedbackScheme.scope('surveys').findByPk(feedbackSchemeId);
    if (!feedbackScheme) throw new NotFoundError();

    if (feedbackScheme.surveys?.length)
      throw new ForbiddenError(
        'Feedback scheme cannot be deleted. There are surveys using this feedback scheme.'
      );

    await feedbackScheme.destroy();
    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<FeedbackSchemeRefs>): Promise<void> => {
    const [languages, nutrients] = await Promise.all([
      Language.scope('list').findAll(),
      SystemNutrientType.findAll({ order: [['id', 'ASC']] }),
    ]);

    res.json({ languages, nutrients });
  };

  const copy = async (req: Request, res: Response<FeedbackSchemeEntry>): Promise<void> => {
    const { sourceId, name } = req.body;

    const sourceFeedbackScheme = await FeedbackScheme.findByPk(sourceId);
    if (!sourceFeedbackScheme) throw new NotFoundError();

    const { type, topFoods, foodGroups, henryCoefficients } = sourceFeedbackScheme;

    const feedbackScheme = await FeedbackScheme.create({
      name,
      type,
      topFoods,
      foodGroups,
      henryCoefficients,
    });

    res.json(feedbackScheme);
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
  };
};
