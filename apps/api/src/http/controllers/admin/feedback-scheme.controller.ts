import type { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  PaginateQuery,
  FeedbackScheme,
  SystemNutrientType,
  Language,
  Op,
  PhysicalActivityLevel,
  securableScope,
  PaginateOptions,
} from '@intake24/db';
import type {
  FeedbackSchemeEntry,
  FeedbackSchemesResponse,
  FeedbackSchemeRefs,
} from '@intake24/common/types/http/admin';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import {
  FeedbackSchemeCreationAttributes,
  updateFeedbackSchemeFields,
} from '@intake24/common/types/models';
import { kebabCase } from '@intake24/common/util';
import type { Controller, CrudActions } from '../controller';
import securableController, { SecurableController } from './securable.controller';

export interface FeedbackSchemeController
  extends Controller<Exclude<CrudActions, 'edit'> | 'patch' | 'put' | 'copy'> {
  securables: SecurableController;
}

export default (): FeedbackSchemeController => {
  const getAndCheckAccess = async (
    req: Request<{ feedbackSchemeId: string }>,
    action: string,
    scope?: string
  ): Promise<FeedbackScheme> => {
    const { feedbackSchemeId } = req.params;
    const { aclService, userId } = req.scope.cradle;

    const feedbackScheme = await FeedbackScheme.scope(scope).findByPk(
      feedbackSchemeId,
      securableScope(userId)
    );
    if (!feedbackScheme) throw new NotFoundError();

    const hasAccess = await aclService.canAccessRecord(feedbackScheme, action);
    if (!hasAccess) throw new ForbiddenError();

    return feedbackScheme;
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FeedbackSchemesResponse>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [['name', 'ASC']],
    };

    if (await aclService.hasPermission('feedback-schemes|browse')) {
      const feedbackSchemes = await FeedbackScheme.paginate(paginateOptions);
      res.json(feedbackSchemes);
      return;
    }

    const feedbackSchemes = await FeedbackScheme.paginate({
      ...paginateOptions,
      where: { [Op.or]: { ownerId: userId, '$securables.action$': ['read', 'edit', 'delete'] } },
      ...securableScope(userId),
      subQuery: false,
    });

    res.json(feedbackSchemes);
  };

  const store = async (
    req: Request<any, any, FeedbackSchemeCreationAttributes>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const { userId } = req.scope.cradle;

    const feedbackScheme = await FeedbackScheme.create({
      ...pick(req.body, updateFeedbackSchemeFields),
      ownerId: userId,
    });

    res.status(201).json(feedbackScheme);
  };

  const read = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const feedbackScheme = await getAndCheckAccess(req, 'read');

    res.json(feedbackScheme);
  };

  const update = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const feedbackScheme = await getAndCheckAccess(req, 'edit');

    await feedbackScheme.update(pick(req.body, updateFeedbackSchemeFields));

    res.json(feedbackScheme);
  };

  const patch = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const feedbackScheme = await getAndCheckAccess(req, 'edit');
    const keysToUpdate: string[] = [];

    if (feedbackScheme.ownerId === userId) {
      keysToUpdate.push(...updateFeedbackSchemeFields);
    } else {
      const actions = await aclService.getAccessActions(feedbackScheme, 'feedback-schemes');

      if (actions.includes('edit')) keysToUpdate.push('name', 'type');

      ['topFoods', 'cards', 'demographicGroups', 'henryCoefficients'].forEach((item) => {
        if (actions.includes(kebabCase(item))) keysToUpdate.push(item);
      });
    }

    const updateInput = pick(req.body, keysToUpdate);
    if (!Object.keys(updateInput).length) throw new ValidationError('Missing body');

    await feedbackScheme.update(updateInput);

    res.json(feedbackScheme);
  };

  const put = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => update(req, res);

  const destroy = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const feedbackScheme = await getAndCheckAccess(req, 'delete', 'surveys');

    if (!feedbackScheme.surveys || feedbackScheme.surveys.length)
      throw new ForbiddenError(
        'Feedback scheme cannot be deleted. There are surveys using this feedback scheme.'
      );

    await feedbackScheme.destroy();

    // TODO: delete securable records

    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<FeedbackSchemeRefs>): Promise<void> => {
    const [languages, nutrientTypes, physicalActivityLevels] = await Promise.all([
      Language.scope('list').findAll(),
      SystemNutrientType.scope('list').findAll(),
      PhysicalActivityLevel.scope('list').findAll(),
    ]);

    res.json({ languages, nutrientTypes, physicalActivityLevels });
  };

  const copy = async (req: Request, res: Response<FeedbackSchemeEntry>): Promise<void> => {
    const { sourceId, name } = req.body;
    const { aclService, userId } = req.scope.cradle;

    const sourceFeedbackScheme = await FeedbackScheme.findByPk(sourceId, securableScope(userId));
    if (!sourceFeedbackScheme) throw new NotFoundError();

    const hasAccess = await aclService.canAccessRecord(sourceFeedbackScheme, 'copy');
    if (!hasAccess) throw new ForbiddenError();

    const { type, topFoods, cards, demographicGroups, henryCoefficients } = sourceFeedbackScheme;

    const feedbackScheme = await FeedbackScheme.create({
      name,
      type,
      topFoods,
      cards,
      demographicGroups,
      henryCoefficients,
      ownerId: userId,
    });

    res.json(feedbackScheme);
  };

  return {
    browse,
    store,
    read,
    update,
    patch,
    put,
    destroy,
    refs,
    copy,
    securables: securableController(FeedbackScheme),
  };
};
