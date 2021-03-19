import { Request, Response } from 'express';
import { NotFoundError } from '@/http/errors';
import { GuideImageResponse, GuideImagesResponse } from '@common/types/http/admin';
import type { IoC } from '@/ioc';
import { GuideImage } from '@/db/models/foods';
import imagesResponseCollection from '@/http/responses/admin/images';
import { Controller, CrudActions } from '../../controller';

export type GuideImageController = Controller<CrudActions>;

export default ({
  config,
  portionSizeService,
}: Pick<IoC, 'config' | 'portionSizeService'>): GuideImageController => {
  const responseCollection = imagesResponseCollection(config.app.urls.images);

  const entry = async (req: Request, res: Response<GuideImageResponse>): Promise<void> => {
    const { imageId } = req.params;

    const image = await portionSizeService.getGuideImage(imageId);

    if (!image) throw new NotFoundError();

    const data = responseCollection.guideEntryResponse(image);

    res.json({ data, refs: {} });
  };

  const browse = async (req: Request, res: Response<GuideImagesResponse>): Promise<void> => {
    const images = await GuideImage.paginate({
      req,
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['selectionImage'],
      transform: responseCollection.guideListResponse,
    });

    res.json(images);
  };

  // TODO: create / update / delete

  const create = async (req: Request, res: Response): Promise<void> => {
    res.json({ refs: {} });
  };

  const store = async (req: Request, res: Response): Promise<void> => {
    // const image = await GuideImage.create();

    // res.status(201).json({ data: image });
    res.status(201).json();
  };

  const detail = async (req: Request, res: Response<GuideImageResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<GuideImageResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<GuideImageResponse>): Promise<void> => {
    const { imageId } = req.params;

    const image = await GuideImage.findByPk(imageId);

    if (!image) throw new NotFoundError();

    // await image.update();

    const data = responseCollection.guideEntryResponse(image);

    res.json({ data, refs: {} });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { imageId } = req.params;

    const image = await GuideImage.findByPk(imageId);

    if (!image) throw new NotFoundError();

    // await image.destroy();

    res.status(204).json();
  };

  return {
    browse,
    create,
    store,
    detail,
    edit,
    update,
    destroy,
  };
};
