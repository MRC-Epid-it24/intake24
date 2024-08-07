import type { Request, Response } from 'express';
import { pick } from 'lodash';

import type { IoC } from '@intake24/api/ioc';
import type { AsServedImageEntry, AsServedImagesResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { imageResponseCollection } from '@intake24/api/http/responses/admin';
import { AsServedImage, AsServedSet } from '@intake24/db';

function asServedImageController({
  imagesBaseUrl,
  asServedService,
  portionSizeService,
}: Pick<IoC, 'imagesBaseUrl' | 'asServedService' | 'portionSizeService'>) {
  const responseCollection = imageResponseCollection(imagesBaseUrl);

  const entry = async (
    req: Request<{ asServedSetId: string; asServedImageId: string }>,
    res: Response<AsServedImageEntry>,
  ): Promise<void> => {
    const { asServedSetId, asServedImageId } = req.params;

    const asServedImage = await portionSizeService.getAsServedImage(asServedSetId, asServedImageId);
    if (!asServedImage)
      throw new NotFoundError();

    res.json(responseCollection.asServedImageEntryResponse(asServedImage));
  };

  const browse = async (
    req: Request<{ asServedSetId: string }, any, any, PaginateQuery>,
    res: Response<AsServedImagesResponse>,
  ): Promise<void> => {
    const { asServedSetId } = req.params;

    const asServedSet = await AsServedSet.findByPk(asServedSetId, { attributes: ['id'] });
    if (!asServedSet)
      throw new NotFoundError();

    const asServedImages = await AsServedImage.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id'],
      order: [['id', 'ASC']],
      where: { asServedSetId },
      include: ['image', 'thumbnailImage'],
      transform: responseCollection.asServedImageEntryResponse,
    });

    res.json(asServedImages);
  };

  const store = async (
    req: Request<{ asServedSetId: string }>,
    res: Response<AsServedImageEntry>,
  ): Promise<void> => {
    const {
      file,
      body: { weight },
      params: { asServedSetId },
    } = req;
    const { userId } = req.scope.cradle.user;

    if (!file)
      throw new ValidationError('File not found.', { path: 'image' });

    const asServedSet = await AsServedSet.findByPk(asServedSetId, { attributes: ['id'] });
    if (!asServedSet)
      throw new NotFoundError();

    let asServedImage = await asServedService.createImage({
      id: asServedSetId,
      file,
      uploader: userId,
      weight,
    });
    asServedImage = await portionSizeService.getAsServedImage(asServedSetId, asServedImage.id);

    res.status(201).json(responseCollection.asServedImageEntryResponse(asServedImage));
  };

  const read = async (
    req: Request<{ asServedSetId: string; asServedImageId: string }>,
    res: Response<AsServedImageEntry>,
  ): Promise<void> => entry(req, res);

  const destroy = async (
    req: Request<{ asServedSetId: string; asServedImageId: string }>,
    res: Response<undefined>,
  ): Promise<void> => {
    const { asServedSetId, asServedImageId } = req.params;

    const result = await asServedService.destroyImage(asServedSetId, asServedImageId);
    if (!result)
      throw new NotFoundError();

    res.status(204).json();
  };

  const destroyAll = async (
    req: Request<{ asServedSetId: string }>,
    res: Response<undefined>,
  ): Promise<void> => {
    const { asServedSetId } = req.params;

    await asServedService.destroyImage(asServedSetId);

    res.status(204).json();
  };

  return {
    browse,
    store,
    read,
    destroy,
    destroyAll,
  };
}

export default asServedImageController;

export type AsServedImageController = ReturnType<typeof asServedImageController>;
