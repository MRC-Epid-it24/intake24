import type { Request, Response } from 'express';
import { pick } from 'lodash';
import type { ImageMapEntry, ImageMapsResponse } from '@intake24/common/types/http/admin';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import type { IoC } from '@intake24/api/ioc';
import type { User, PaginateQuery } from '@intake24/db';
import { ImageMap } from '@intake24/db';
import imagesResponseCollection from '@intake24/api/http/responses/admin/images';
import type { Controller, CrudActions } from '../../controller';

export type ImageMapController = Controller<CrudActions>;

export default ({
  imagesBaseUrl,
  imageMapService,
  portionSizeService,
}: Pick<IoC, 'imagesBaseUrl' | 'imageMapService' | 'portionSizeService'>): ImageMapController => {
  const responseCollection = imagesResponseCollection(imagesBaseUrl);

  const entry = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>
  ): Promise<void> => {
    const { imageMapId } = req.params;

    const image = await portionSizeService.getImageMap(imageMapId);
    if (!image) throw new NotFoundError();

    res.json(responseCollection.mapEntryResponse(image));
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<ImageMapsResponse>
  ): Promise<void> => {
    const images = await ImageMap.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [['id', 'ASC']],
      include: ['baseImage'],
      transform: responseCollection.mapListResponse,
    });

    res.json(images);
  };

  const store = async (req: Request, res: Response<ImageMapEntry>): Promise<void> => {
    const {
      file,
      body: { id, description },
    } = req;
    const user = req.user as User;

    if (!file) throw new ValidationError('File not found.', { param: 'baseImage' });

    let imageMap = await imageMapService.create({ id, description, file, uploader: user.id });
    imageMap = await portionSizeService.getImageMap(imageMap.id);

    res.status(201).json(responseCollection.mapEntryResponse(imageMap));
  };

  const read = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>
  ): Promise<void> => {
    const { imageMapId } = req.params;
    const { description, objects } = req.body;

    const image = await imageMapService.update(imageMapId, { description, objects });

    res.json(responseCollection.mapEntryResponse(image));
  };

  const destroy = async (
    req: Request<{ imageMapId: string }>,
    res: Response<undefined>
  ): Promise<void> => {
    const { imageMapId } = req.params;

    await imageMapService.destroy(imageMapId);

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
