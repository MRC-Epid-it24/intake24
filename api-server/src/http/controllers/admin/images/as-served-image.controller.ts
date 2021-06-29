import { Request, Response } from 'express';
import { NotFoundError } from '@/http/errors';
import {
  AsServedImageEntry,
  AsServedImageResponse,
  AsServedImagesResponse,
} from '@common/types/http/admin';
import type { IoC } from '@/ioc';
import { AsServedImage, AsServedSet } from '@/db/models/foods';
import { User } from '@/db/models/system';
import imagesResponseCollection from '@/http/responses/admin/images';
import { Controller } from '../../controller';

export type AsServedImageController = Controller<'browse' | 'store' | 'detail' | 'destroy'>;

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

  const browse = async (req: Request, res: Response<AsServedImagesResponse>): Promise<void> => {
    const { asServedSetId } = req.params;

    const asServedSet = await AsServedSet.findByPk(asServedSetId);
    if (!asServedSet) throw new NotFoundError();

    const asServedImages = await AsServedImage.paginate<AsServedImageEntry>({
      req,
      columns: ['id'],
      order: [['id', 'ASC']],
      where: { asServedSetId },
      include: ['image', 'thumbnailImage'],
      transform: responseCollection.asServedImageEntryResponse,
    });

    res.json(asServedImages);
  };

  const store = async (req: Request, res: Response<AsServedImageResponse>): Promise<void> => {
    const { asServedSetId } = req.params;

    const asServedSet = await AsServedSet.findByPk(asServedSetId);
    if (!asServedSet) throw new NotFoundError();

    const {
      file,
      body: { weight },
    } = req;
    const user = req.user as User;

    let asServedImage = await asServedService.createImage({
      id: asServedSetId,
      file,
      uploader: user.id,
      weight,
    });
    asServedImage = await portionSizeService.getAsServedImage(asServedSetId, asServedImage.id);

    res.status(201).json({ data: responseCollection.asServedImageEntryResponse(asServedImage) });
  };

  const detail = async (req: Request, res: Response<AsServedImageResponse>): Promise<void> =>
    entry(req, res);

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { asServedSetId, asServedImageId } = req.params;

    await asServedService.destroyImage(asServedSetId, asServedImageId);

    res.status(204).json();
  };

  return {
    browse,
    store,
    detail,
    destroy,
  };
};
