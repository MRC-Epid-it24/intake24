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
  UserSecurable,
} from '@intake24/db';
import type {
  FeedbackSchemeEntry,
  FeedbackSchemesResponse,
  FeedbackSchemeRefs,
} from '@intake24/common/types/http/admin';
import { ForbiddenError, NotFoundError, ValidationError } from '@intake24/api/http/errors';
import {
  FeedbackSchemeCreationAttributes,
  createFeedbackSchemeFields,
  perCardFeedbackSchemeFields,
  updateFeedbackSchemeFields,
} from '@intake24/common/types/models';
import { kebabCase } from '@intake24/common/util';
import type { IoC } from '@intake24/api/ioc';
import type { Controller, CrudActions } from '../controller';
import securableController, { SecurableController } from './securable.controller';

export interface FeedbackSchemeController
  extends Controller<CrudActions | 'patch' | 'put' | 'copy'> {
  securables: SecurableController;
}

export default (ioc: IoC): FeedbackSchemeController => {
  const getAndCheckAccess = async (
    req: Request<{ feedbackSchemeId: string }>,
    action: string,
    scope?: string | string[]
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
      ...pick(req.body, createFeedbackSchemeFields),
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

  const edit = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const feedbackScheme = await getAndCheckAccess(req, 'edit');

    res.json(feedbackScheme);
  };

  const update = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const feedbackScheme = await getAndCheckAccess(req, 'edit');

    await feedbackScheme.update(pick(req.body, createFeedbackSchemeFields));

    res.json(feedbackScheme);
  };

  const patch = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const { aclService, userId } = req.scope.cradle;

    const feedbackScheme = await getAndCheckAccess(req, 'edit');

    const keysToUpdate: string[] = [];
    const [resourceActions, securableActions] = await Promise.all([
      aclService.getResourceAccessActions('feedback-schemes'),
      aclService.getSecurableAccessActions(feedbackScheme),
    ]);

    if (resourceActions.includes('edit') || feedbackScheme.ownerId === userId) {
      keysToUpdate.push(...createFeedbackSchemeFields);
    } else {
      if (securableActions.includes('edit')) keysToUpdate.push(...updateFeedbackSchemeFields);

      perCardFeedbackSchemeFields.forEach((item) => {
        if (securableActions.includes(kebabCase(item))) keysToUpdate.push(item);
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
    const { id: securableId, surveys } = feedbackScheme;

    if (!surveys || surveys.length)
      throw new ForbiddenError(
        'Feedback scheme cannot be deleted. There are surveys using this feedback scheme.'
      );

    await Promise.all([
      UserSecurable.destroy({ where: { securableId, securableType: 'FeedbackScheme' } }),
      feedbackScheme.destroy(),
    ]);

    res.status(204).json();
  };

  const copy = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>
  ): Promise<void> => {
    const feedbackScheme = await getAndCheckAccess(req, 'copy');

    const { name } = req.body;
    const { userId } = req.scope.cradle;
    const {
      type,
      outputs,
      physicalDataFields,
      topFoods,
      cards,
      demographicGroups,
      henryCoefficients,
    } = feedbackScheme;

    const feedbackSchemeCopy = await FeedbackScheme.create({
      name,
      type,
      outputs,
      physicalDataFields,
      topFoods,
      cards,
      demographicGroups,
      henryCoefficients,
      ownerId: userId,
    });

    res.json(feedbackSchemeCopy);
  };

  const refs = async (req: Request, res: Response<FeedbackSchemeRefs>): Promise<void> => {
    const [languages, nutrientTypes, physicalActivityLevels] = await Promise.all([
      Language.scope('list').findAll(),
      SystemNutrientType.scope('list').findAll(),
      PhysicalActivityLevel.scope('list').findAll(),
    ]);

    res.json({ languages, nutrientTypes, physicalActivityLevels });
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
    securables: securableController({ ioc, securable: FeedbackScheme }),
  };
};
