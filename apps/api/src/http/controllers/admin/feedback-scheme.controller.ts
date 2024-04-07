import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type {
  FeedbackSchemeEntry,
  FeedbackSchemeRefs,
  FeedbackSchemesResponse,
} from '@intake24/common/types/http/admin';
import type {
  FeedbackSchemeCreationAttributes,
  PaginateOptions,
  PaginateQuery,
} from '@intake24/db';
import { ForbiddenError, ValidationError } from '@intake24/api/http/errors';
import { feedbackSchemeResponse } from '@intake24/api/http/responses/admin';
import { kebabCase } from '@intake24/common/util';
import {
  createFeedbackSchemeFields,
  FeedbackScheme,
  Op,
  perCardFeedbackSchemeFields,
  PhysicalActivityLevel,
  securableScope,
  SystemNutrientType,
  updateFeedbackSchemeFields,
  UserSecurable,
} from '@intake24/db';

import { securableController } from './securable.controller';

function feedbackSchemeController(ioc: IoC) {
  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<FeedbackSchemesResponse>,
  ): Promise<void> => {
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const paginateOptions: PaginateOptions = {
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['name'],
      order: [[fn('lower', col('FeedbackScheme.name')), 'ASC']],
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
    res: Response<FeedbackSchemeEntry>,
  ): Promise<void> => {
    const { userId } = req.scope.cradle.user;

    const feedbackScheme = await FeedbackScheme.create({
      ...pick(req.body, createFeedbackSchemeFields),
      ownerId: userId,
    });

    res.status(201).json(feedbackSchemeResponse(feedbackScheme));
  };

  const read = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>,
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const feedbackScheme = await aclService.findAndCheckRecordAccess(FeedbackScheme, 'read', {
      where: { id: feedbackSchemeId },
    });

    res.json(feedbackSchemeResponse(feedbackScheme));
  };

  const edit = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>,
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const feedbackScheme = await aclService.findAndCheckRecordAccess(FeedbackScheme, 'edit', {
      where: { id: feedbackSchemeId },
    });

    res.json(feedbackSchemeResponse(feedbackScheme));
  };

  const update = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>,
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const feedbackScheme = await aclService.findAndCheckRecordAccess(FeedbackScheme, 'edit', {
      where: { id: feedbackSchemeId },
    });

    await feedbackScheme.update(pick(req.body, createFeedbackSchemeFields));

    res.json(feedbackSchemeResponse(feedbackScheme));
  };

  const patch = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>,
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const feedbackScheme = await aclService.findAndCheckRecordAccess(FeedbackScheme, 'edit', {
      where: { id: feedbackSchemeId },
    });

    const keysToUpdate: string[] = [];
    const [resourceActions, securableActions] = await Promise.all([
      aclService.getResourceAccessActions('feedback-schemes'),
      aclService.getSecurableAccessActions(feedbackScheme),
    ]);

    if (resourceActions.includes('edit') || feedbackScheme.ownerId === userId) {
      keysToUpdate.push(...createFeedbackSchemeFields);
    }
    else {
      if (securableActions.includes('edit'))
        keysToUpdate.push(...updateFeedbackSchemeFields);

      perCardFeedbackSchemeFields.forEach((item) => {
        if (securableActions.includes(kebabCase(item)))
          keysToUpdate.push(item);
      });
    }

    const updateInput = pick(req.body, keysToUpdate);
    if (!Object.keys(updateInput).length)
      throw new ValidationError('Missing body');

    await feedbackScheme.update(updateInput);

    res.json(feedbackSchemeResponse(feedbackScheme));
  };

  const put = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>,
  ): Promise<void> => update(req, res);

  const destroy = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<undefined>,
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;
    const { aclService } = req.scope.cradle;

    const feedbackScheme = await aclService.findAndCheckRecordAccess(FeedbackScheme, 'delete', {
      attributes: ['id'],
      where: { id: feedbackSchemeId },
      include: [{ association: 'surveys', attributes: ['id'] }],
    });

    const { id: securableId, surveys } = feedbackScheme;

    if (!surveys || surveys.length) {
      throw new ForbiddenError(
        'Feedback scheme cannot be deleted. There are surveys using this feedback scheme.',
      );
    }

    await Promise.all([
      UserSecurable.destroy({ where: { securableId, securableType: 'FeedbackScheme' } }),
      feedbackScheme.destroy(),
    ]);

    res.status(204).json();
  };

  const copy = async (
    req: Request<{ feedbackSchemeId: string }>,
    res: Response<FeedbackSchemeEntry>,
  ): Promise<void> => {
    const { feedbackSchemeId } = req.params;
    const {
      aclService,
      user: { userId },
    } = req.scope.cradle;

    const feedbackScheme = await aclService.findAndCheckRecordAccess(FeedbackScheme, 'copy', {
      where: { id: feedbackSchemeId },
    });

    const { name } = req.body;
    const {
      type,
      visibility,
      outputs,
      physicalDataFields,
      sections,
      topFoods,
      meals,
      cards,
      demographicGroups,
      henryCoefficients,
    } = feedbackScheme;

    const feedbackSchemeCopy = await FeedbackScheme.create({
      name,
      type,
      visibility,
      outputs,
      physicalDataFields,
      sections,
      topFoods,
      meals,
      cards,
      demographicGroups,
      henryCoefficients,
      ownerId: userId,
    });

    res.json(feedbackSchemeResponse(feedbackSchemeCopy));
  };

  const refs = async (req: Request, res: Response<FeedbackSchemeRefs>): Promise<void> => {
    const [nutrientTypes, physicalActivityLevels] = await Promise.all([
      SystemNutrientType.scope('list').findAll(),
      PhysicalActivityLevel.scope('list').findAll(),
    ]);

    res.json({ nutrientTypes, physicalActivityLevels });
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
}

export default feedbackSchemeController;

export type FeedbackSchemeController = ReturnType<typeof feedbackSchemeController>;
