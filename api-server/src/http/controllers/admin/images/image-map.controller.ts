import { Request, Response } from 'express';
import { NotFoundError } from '@/http/errors';
import {
  ImageMapListEntry,
  ImageMapResponse,
  ImageMapsResponse,
  CreateImageMapResponse,
  StoreImageMapResponse,
} from '@common/types/http/admin';
import type { IoC } from '@/ioc';
import { ImageMap } from '@/db/models/foods';
import { User } from '@/db/models/system';
import imagesResponseCollection from '@/http/responses/admin/images';
import { Controller, CrudActions } from '../../controller';

export type ImageMapController = Controller<CrudActions>;

export default ({
  imagesBaseUrl,
  imageMapService,
  portionSizeService,
}: Pick<IoC, 'imagesBaseUrl' | 'imageMapService' | 'portionSizeService'>): ImageMapController => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const entry = async (req: Request, res: Response<ImageMapResponse>): Promise<void> => {
    const { imageMapId } = req.params;

    const image = await portionSizeService.getImageMap(imageMapId);
    if (!image) throw new NotFoundError();

    res.json({ data: responseCollection.mapEntryResponse(image), refs: {} });
  };

  const browse = async (req: Request, res: Response<ImageMapsResponse>): Promise<void> => {
    const images = await ImageMap.paginate<ImageMapListEntry>({
      req,
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['baseImage'],
      transform: responseCollection.mapListResponse,
    });

    res.json(images);
  };

  const create = async (req: Request, res: Response<CreateImageMapResponse>): Promise<void> => {
    res.json({ refs: {} });
  };

  const store = async (req: Request, res: Response<StoreImageMapResponse>): Promise<void> => {
    const {
      file,
      body: { id, description },
    } = req;
    const user = req.user as User;

    let imageMap = await imageMapService.create({ id, description, file, uploader: user.id });
    imageMap = await portionSizeService.getImageMap(imageMap.id);

    res.status(201).json({ data: responseCollection.mapEntryResponse(imageMap) });
  };

  const detail = async (req: Request, res: Response<ImageMapResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<ImageMapResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<ImageMapResponse>): Promise<void> => {
    const { imageMapId } = req.params;
    const { description, objects } = req.body;

    const image = await imageMapService.update(imageMapId, { description, objects });

    res.json({ data: responseCollection.mapEntryResponse(image), refs: {} });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { imageMapId } = req.params;

    await imageMapService.destroy(imageMapId);

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
