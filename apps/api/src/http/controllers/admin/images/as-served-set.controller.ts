import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type { AsServedSetEntry, AsServedSetsResponse } from '@intake24/common/types/http/admin';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import { AsServedSet, User, PaginateQuery } from '@intake24/db';
import imagesResponseCollection from '@intake24/api/http/responses/admin/images';
import type { Controller, CrudActions } from '../../controller';

export type AsServedSetController = Controller<CrudActions>;

export default ({
  imagesBaseUrl,
  asServedService,
  portionSizeService,
}: Pick<
  IoC,
  'imagesBaseUrl' | 'asServedService' | 'portionSizeService'
>): AsServedSetController => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const entry = async (
    req: Request<{ asServedSetId: string }>,
    res: Response<AsServedSetEntry>
  ): Promise<void> => {
    const { asServedSetId } = req.params;

    const asServedSet = await portionSizeService.getAsServedSet(asServedSetId);
    if (!asServedSet) throw new NotFoundError();

    res.json(responseCollection.asServedSetEntryResponse(asServedSet));
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<AsServedSetsResponse>
  ): Promise<void> => {
    const asServedSets = await AsServedSet.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['selectionImage'],
      transform: responseCollection.asServedSetListResponse,
    });

    res.json(asServedSets);
  };

  const store = async (req: Request, res: Response<AsServedSetEntry>): Promise<void> => {
    const {
      file,
      body: { id, description },
    } = req;
    const user = req.user as User;

    if (!file) throw new ValidationError('File not found.', { param: 'image' });

    let asServedSet = await asServedService.createSet({ id, description, file, uploader: user.id });
    asServedSet = await portionSizeService.getAsServedSet(asServedSet.id);

    res.status(201).json(responseCollection.asServedSetEntryResponse(asServedSet));
  };

  const read = async (
    req: Request<{ asServedSetId: string }>,
    res: Response<AsServedSetEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ asServedSetId: string }>,
    res: Response<AsServedSetEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ asServedSetId: string }>,
    res: Response<AsServedSetEntry>
  ): Promise<void> => {
    const { asServedSetId } = req.params;
    const { description, images } = req.body;

    const asServedSet = await asServedService.updateSet(asServedSetId, { description, images });

    res.json(responseCollection.asServedSetEntryResponse(asServedSet));
  };

  const destroy = async (
    req: Request<{ asServedSetId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { asServedSetId } = req.params;

    await asServedService.destroySet(asServedSetId);

    res.status(204).json();
  };

  const refs = async (): Promise<void> => {
    throw new NotFoundError();
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
