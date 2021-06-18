import { Request, Response } from 'express';
import { NotFoundError } from '@/http/errors';
import {
  GuideImageListEntry,
  GuideImageResponse,
  GuideImagesResponse,
  CreateGuideImageResponse,
  StoreGuideImageResponse,
} from '@common/types/http/admin';
import type { IoC } from '@/ioc';
import { GuideImage, ImageMap } from '@/db/models/foods';
import imagesResponseCollection from '@/http/responses/admin/images';
import { Controller, CrudActions } from '../../controller';

export type GuideImageController = Controller<CrudActions>;

export default ({
  imagesBaseUrl,
  guideImageService,
  portionSizeService,
}: Pick<
  IoC,
  'imagesBaseUrl' | 'guideImageService' | 'portionSizeService'
>): GuideImageController => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const entry = async (req: Request, res: Response<GuideImageResponse>): Promise<void> => {
    const { guideImageId } = req.params;

    const guideImage = await portionSizeService.getGuideImage(guideImageId);
    if (!guideImage) throw new NotFoundError();

    res.json({ data: responseCollection.guideEntryResponse(guideImage), refs: {} });
  };

  const browse = async (req: Request, res: Response<GuideImagesResponse>): Promise<void> => {
    const guideImages = await GuideImage.paginate<GuideImageListEntry>({
      req,
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['selectionImage'],
      transform: responseCollection.guideListResponse,
    });

    res.json(guideImages);
  };

  const create = async (req: Request, res: Response<CreateGuideImageResponse>): Promise<void> => {
    const imageMaps = await ImageMap.findAll({
      attributes: ['id', 'description'],
      order: [['id', 'ASC']],
    });

    res.json({
      refs: { imageMaps: imageMaps.map(({ id, description }) => ({ id, description })) },
    });
  };

  const store = async (req: Request, res: Response<StoreGuideImageResponse>): Promise<void> => {
    const { id, description, imageMapId } = req.body;

    await guideImageService.create({ id, description, imageMapId });

    const guideImage = await portionSizeService.getGuideImage(id);
    if (!guideImage) throw new NotFoundError();

    res.status(201).json({ data: responseCollection.guideEntryResponse(guideImage) });
  };

  const detail = async (req: Request, res: Response<GuideImageResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<GuideImageResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<GuideImageResponse>): Promise<void> => {
    const { guideImageId } = req.params;
    const { description, objects } = req.body;

    const guideImage = await guideImageService.update(guideImageId, {
      description,
      objects,
    });

    res.json({ data: responseCollection.guideEntryResponse(guideImage), refs: {} });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { guideImageId } = req.params;

    await guideImageService.destroy(guideImageId);

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
