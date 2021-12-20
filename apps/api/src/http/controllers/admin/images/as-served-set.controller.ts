import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  AsServedSetEntry,
  AsServedSetsResponse,
  AsServedSetListEntry,
} from '@common/types/http/admin';
import { NotFoundError, ValidationError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { AsServedSet } from '@api/db/models/foods';
import { User } from '@api/db/models/system';
import imagesResponseCollection from '@api/http/responses/admin/images';
import { PaginateQuery } from '@api/db/models/model';
import { Controller, CrudActions } from '../../controller';

export type AsServedSetController = Controller<Exclude<CrudActions, 'refs'>>;

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
    const asServedSets = await AsServedSet.paginate<AsServedSetListEntry>({
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

    if (!file) throw new ValidationError('image', 'File not found.');

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

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
  };
};
