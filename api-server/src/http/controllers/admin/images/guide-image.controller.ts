import { Request, Response } from 'express';
import { NotFoundError } from '@/http/errors';
import {
  GuideImageListEntry,
  GuideImageResponse,
  GuideImagesResponse,
} from '@common/types/http/admin';
import type { IoC } from '@/ioc';
import { GuideImage, GuideImageObject, ImageMap, ImageMapObject } from '@/db/models/foods';
import imagesResponseCollection from '@/http/responses/admin/images';
import { Controller, CrudActions } from '../../controller';

export type GuideImageController = Controller<CrudActions>;

export default ({
  config,
  portionSizeService,
}: Pick<IoC, 'config' | 'portionSizeService'>): GuideImageController => {
  const responseCollection = imagesResponseCollection(config.app.urls.images);

  const entry = async (req: Request, res: Response<GuideImageResponse>): Promise<void> => {
    const { guideId } = req.params;

    const image = await portionSizeService.getGuideImage(guideId);
    if (!image) throw new NotFoundError();

    const data = responseCollection.guideEntryResponse(image);

    res.json({ data, refs: {} });
  };

  const browse = async (req: Request, res: Response<GuideImagesResponse>): Promise<void> => {
    const images = await GuideImage.paginate<GuideImageListEntry>({
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
    const imageMaps = await ImageMap.findAll({
      attributes: ['id', 'description'],
      order: [['id', 'ASC']],
    });

    res.json({
      refs: { imageMaps: imageMaps.map(({ id, description }) => ({ id, description })) },
    });
  };

  const store = async (req: Request, res: Response): Promise<void> => {
    const { id, description, imageMapId } = req.body;

    const imageMap = await ImageMap.findByPk(imageMapId);
    if (!imageMap) throw new NotFoundError();

    /*
     * TODO:
     * 1) trigger selection image generation
     * 2) update GuideImage record with selection image
     */
    const guideImage = await GuideImage.create({
      id,
      description,
      imageMapId,
      selectionImageId: imageMap.baseImageId,
    });

    const imageMapObjects = await ImageMapObject.findAll({
      where: { imageMapId },
      order: [['id', 'ASC']],
    });
    const guideImageObjects = imageMapObjects.map((object) => ({
      guideImageId: guideImage.id,
      imageMapObjectId: object.id,
      weight: 0,
    }));

    await GuideImageObject.bulkCreate(guideImageObjects);

    res.status(201).json({ data: guideImage });
  };

  const detail = async (req: Request, res: Response<GuideImageResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<GuideImageResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<GuideImageResponse>): Promise<void> => {
    const { guideId } = req.params;
    const { description } = req.body;

    const guideImage = await GuideImage.findByPk(guideId);
    if (!guideImage) throw new NotFoundError();

    await guideImage.update({ description });

    // TODO update weights

    return entry(req, res);
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { guideId } = req.params;

    const guideImage = await GuideImage.findByPk(guideId, { include: ['selectionImage'] });
    if (!guideImage) throw new NotFoundError();

    await guideImage.destroy();

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
