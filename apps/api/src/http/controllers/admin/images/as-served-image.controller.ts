import { Request, Response } from 'express';
import { pick } from 'lodash';
import {
  AsServedImageEntry,
  AsServedImageResponse,
  AsServedImagesResponse,
} from '@common/types/http/admin';
import { NotFoundError, ValidationError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { AsServedImage, AsServedSet } from '@api/db/models/foods';
import { User } from '@api/db/models/system';
import imagesResponseCollection from '@api/http/responses/admin/images';
import { PaginateQuery } from '@api/db/models/model';
import { Controller } from '../../controller';

export type AsServedImageController = Controller<'browse' | 'store' | 'read' | 'destroy'>;

export default ({
  imagesBaseUrl,
  asServedService,
  portionSizeService,
}: Pick<
  IoC,
  'imagesBaseUrl' | 'asServedService' | 'portionSizeService'
>): AsServedImageController => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const entry = async (req: Request, res: Response<AsServedImageResponse>): Promise<void> => {
    const { asServedSetId, asServedImageId } = req.params;

    const asServedImage = await portionSizeService.getAsServedImage(asServedSetId, asServedImageId);
    if (!asServedImage) throw new NotFoundError();

    res.json({ data: responseCollection.asServedImageEntryResponse(asServedImage) });
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<AsServedImagesResponse>
  ): Promise<void> => {
    const { asServedSetId } = req.params;

    const asServedSet = await AsServedSet.findByPk(asServedSetId);
    if (!asServedSet) throw new NotFoundError();

    const asServedImages = await AsServedImage.paginate<AsServedImageEntry>({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id'],
      order: [['id', 'ASC']],
      where: { asServedSetId },
      include: ['image', 'thumbnailImage'],
      transform: responseCollection.asServedImageEntryResponse,
    });

    res.json(asServedImages);
  };

  const store = async (req: Request, res: Response<AsServedImageResponse>): Promise<void> => {
    const {
      file,
      body: { weight },
      params: { asServedSetId },
    } = req;
    const user = req.user as User;

    if (!file) throw new ValidationError('image', 'File not found.');

    const asServedSet = await AsServedSet.findByPk(asServedSetId);
    if (!asServedSet) throw new NotFoundError();

    let asServedImage = await asServedService.createImage({
      id: asServedSetId,
      file,
      uploader: user.id,
      weight,
    });
    asServedImage = await portionSizeService.getAsServedImage(asServedSetId, asServedImage.id);

    res.status(201).json({ data: responseCollection.asServedImageEntryResponse(asServedImage) });
  };

  const read = async (req: Request, res: Response<AsServedImageResponse>): Promise<void> =>
    entry(req, res);

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { asServedSetId, asServedImageId } = req.params;

    const result = await asServedService.destroyImage(asServedSetId, asServedImageId);
    if (!result) throw new NotFoundError();

    res.status(204).json();
  };

  return {
    browse,
    store,
    read,
    destroy,
  };
};
