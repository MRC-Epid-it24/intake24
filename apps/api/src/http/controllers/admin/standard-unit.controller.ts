import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { StandardUnitEntry, StandardUnitsResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { ForbiddenError, NotFoundError } from '@intake24/api/http/errors';
import { CategoryLocal, FoodLocal, Language, Op, StandardUnit } from '@intake24/db';

const standardUnitController = () => {
  const entry = async (
    req: Request<{ standardUnitId: string }>,
    res: Response<StandardUnitEntry>
  ): Promise<void> => {
    const { standardUnitId } = req.params;

    const standardUnit = await StandardUnit.findByPk(standardUnitId);
    if (!standardUnit) throw new NotFoundError();

    res.json(standardUnit);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<StandardUnitsResponse>
  ): Promise<void> => {
    const standardUnits = await StandardUnit.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'estimateIn'],
      order: [['id', 'ASC']],
    });

    res.json(standardUnits);
  };

  const store = async (req: Request, res: Response<StandardUnitEntry>): Promise<void> => {
    const input = pick(req.body, ['id', 'estimateIn', 'howMany']);

    const standardUnit = await StandardUnit.create(input);

    res.status(201).json(standardUnit);
  };

  const read = async (
    req: Request<{ standardUnitId: string }>,
    res: Response<StandardUnitEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ standardUnitId: string }>,
    res: Response<StandardUnitEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ standardUnitId: string }>,
    res: Response<StandardUnitEntry>
  ): Promise<void> => {
    const { standardUnitId } = req.params;

    const standardUnit = await StandardUnit.findByPk(standardUnitId);
    if (!standardUnit) throw new NotFoundError();

    await standardUnit.update(pick(req.body, ['id', 'estimateIn', 'howMany']));

    res.json(standardUnit);
  };

  const destroy = async (
    req: Request<{ standardUnitId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { standardUnitId } = req.params;

    const standardUnit = await StandardUnit.findByPk(standardUnitId, {
      include: [
        {
          association: 'categoryPsmParameters',
          where: { '$categoryPsmParameters.name$': { [Op.endsWith]: '-name' } },
          required: false,
        },
        {
          association: 'foodPsmParameters',
          where: { '$foodPsmParameters.name$': { [Op.endsWith]: '-name' } },
          required: false,
        },
      ],
    });
    if (!standardUnit || !standardUnit.categoryPsmParameters || !standardUnit.foodPsmParameters)
      throw new NotFoundError();

    if (standardUnit.categoryPsmParameters.length || standardUnit.foodPsmParameters.length)
      throw new ForbiddenError(
        'Standard unit cannot be deleted. There are categories/foods using this standard unit.'
      );

    await standardUnit.destroy();

    res.status(204).json();
  };

  const refs = async (req: Request, res: Response): Promise<void> => {
    const languages = await Language.scope('list').findAll();

    res.json({ languages });
  };

  const categories = async (
    req: Request<{ standardUnitId: string }, any, any, PaginateQuery>,
    res: Response
  ): Promise<void> => {
    const { standardUnitId } = req.params;

    const standardUnit = await StandardUnit.findByPk(standardUnitId);
    if (!standardUnit) throw new NotFoundError();

    const categories = await CategoryLocal.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['categoryCode', 'name'],
      subQuery: false,
      include: [
        {
          association: 'portionSizeMethods',
          attributes: ['id'],
          include: [
            {
              association: 'parameters',
              attributes: ['name', 'value'],
              where: {
                '$portionSizeMethods.parameters.name$': { [Op.endsWith]: '-name' },
                '$portionSizeMethods.parameters.value$': standardUnit.id,
              },
              required: true,
            },
          ],
          required: true,
        },
      ],
      order: [['categoryCode', 'ASC']],
    });

    res.json(categories);
  };

  const foods = async (
    req: Request<{ standardUnitId: string }, any, any, PaginateQuery>,
    res: Response
  ): Promise<void> => {
    const { standardUnitId } = req.params;

    const standardUnit = await StandardUnit.findByPk(standardUnitId);
    if (!standardUnit) throw new NotFoundError();

    const foods = await FoodLocal.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['foodCode', 'name'],
      subQuery: false,
      include: [
        {
          association: 'portionSizeMethods',
          attributes: ['id'],
          include: [
            {
              association: 'parameters',
              attributes: ['name', 'value'],
              where: {
                '$portionSizeMethods.parameters.name$': { [Op.endsWith]: '-name' },
                '$portionSizeMethods.parameters.value$': standardUnit.id,
              },
              required: true,
            },
          ],
          required: true,
        },
      ],
      order: [['foodCode', 'ASC']],
    });

    res.json(foods);
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
    categories,
    foods,
  };
};

export default standardUnitController;

export type StandardUnitController = ReturnType<typeof standardUnitController>;
