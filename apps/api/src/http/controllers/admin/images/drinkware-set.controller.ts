import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type {
  DrinkwareSetEntry,
  DrinkwareSetRefs,
  DrinkwareSetsResponse,
} from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError } from '@intake24/api/http/errors';
import imagesResponseCollection from '@intake24/api/http/responses/admin/images';
import { DrinkwareSet, GuideImage, Task } from '@intake24/db';

const drinkwareSetController = ({ imagesBaseUrl }: Pick<IoC, 'imagesBaseUrl'>) => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const entry = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetEntry>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;

    const drinkwareSet = await DrinkwareSet.findByPk(drinkwareSetId);
    if (!drinkwareSet) throw new NotFoundError();

    res.json(drinkwareSet);
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<DrinkwareSetsResponse>
  ): Promise<void> => {
    const tasks = await DrinkwareSet.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: [{ association: 'imageMap', include: [{ association: 'baseImage' }] }],
      transform: responseCollection.drinkwareListResponse,
    });

    res.json(tasks);
  };

  const store = async (req: Request, res: Response<DrinkwareSetEntry>): Promise<void> => {
    const { id, description, guideImageId } = req.body;

    const drinkwareSet = await DrinkwareSet.create({ id, description, guideImageId });

    res.status(201).json(drinkwareSet);
  };

  const read = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<DrinkwareSetEntry>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;

    const drinkwareSet = await DrinkwareSet.findByPk(drinkwareSetId);
    if (!drinkwareSet) throw new NotFoundError();

    const { description, guideImageId } = req.body;

    await drinkwareSet.update({ description, guideImageId });

    res.json(drinkwareSet);
  };

  const destroy = async (
    req: Request<{ drinkwareSetId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { drinkwareSetId } = req.params;

    const drinkwareSet = await Task.findByPk(drinkwareSetId);
    if (!drinkwareSet) throw new NotFoundError();

    await drinkwareSet.destroy();

    res.status(204).json();
  };

  const refs = async (req: Request, res: Response<DrinkwareSetRefs>): Promise<void> => {
    const guideImages = await GuideImage.findAll({
      attributes: ['id', 'description'],
      order: [['id', 'ASC']],
    });

    res.json({ guideImages: guideImages.map(({ id, description }) => ({ id, description })) });
  };

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
    refs,
  };
};

export default drinkwareSetController;

export type DrinkwareSetController = ReturnType<typeof drinkwareSetController>;
