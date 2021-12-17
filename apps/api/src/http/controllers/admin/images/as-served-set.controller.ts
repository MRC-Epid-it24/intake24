import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  AsServedSetResponse,
  AsServedSetsResponse,
  AsServedSetListEntry,
  CreateAsServedSetResponse,
  StoreAsServedSetResponse,
} from '@common/types/http/admin';
import { NotFoundError, ValidationError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { AsServedSet } from '@api/db/models/foods';
import { User } from '@api/db/models/system';
import imagesResponseCollection from '@api/http/responses/admin/images';
import { PaginateQuery } from '@api/db/models/model';
import { Controller, CrudActions } from '../../controller';

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

  const entry = async (req: Request, res: Response<AsServedSetResponse>): Promise<void> => {
    const { asServedSetId } = req.params;

    const asServedSet = await portionSizeService.getAsServedSet(asServedSetId);
    if (!asServedSet) throw new NotFoundError();

    res.json({ data: responseCollection.asServedSetEntryResponse(asServedSet), refs: {} });
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<AsServedSetsResponse>
  ): Promise<void> => {
    const asServedSets = await AsServedSet.paginate<AsServedSetListEntry>({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['selectionImage'],
      transform: responseCollection.asServedSetListResponse,
    });

    res.json(asServedSets);
  };

  const create = async (req: Request, res: Response<CreateAsServedSetResponse>): Promise<void> => {
    res.json({ refs: {} });
  };

  const store = async (req: Request, res: Response<StoreAsServedSetResponse>): Promise<void> => {
    const {
      file,
      body: { id, description },
    } = req;
    const user = req.user as User;

    if (!file) throw new ValidationError('image', 'File not found.');

    let asServedSet = await asServedService.createSet({ id, description, file, uploader: user.id });
    asServedSet = await portionSizeService.getAsServedSet(asServedSet.id);

    res.status(201).json({ data: responseCollection.asServedSetEntryResponse(asServedSet) });
  };

  const read = async (req: Request, res: Response<AsServedSetResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<AsServedSetResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<AsServedSetResponse>): Promise<void> => {
    const { asServedSetId } = req.params;
    const { description, images } = req.body;

    const asServedSet = await asServedService.updateSet(asServedSetId, { description, images });

    res.json({ data: responseCollection.asServedSetEntryResponse(asServedSet), refs: {} });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { asServedSetId } = req.params;

    await asServedService.destroySet(asServedSetId);

    res.status(204).json();
  };

  return {
    browse,
    create,
    store,
    read,
    edit,
    update,
    destroy,
  };
};
