import { Request, Response } from 'express';
import { pick } from 'lodash';
import { ImageMapEntry, ImageMapListEntry, ImageMapsResponse } from '@common/types/http/admin';
import { NotFoundError, ValidationError } from '@api/http/errors';
import type { IoC } from '@api/ioc';
import { ImageMap } from '@api/db/models/foods';
import { User } from '@api/db/models/system';
import imagesResponseCollection from '@api/http/responses/admin/images';
import { PaginateQuery } from '@api/db/models/model';
import { Controller, CrudActions } from '../../controller';

export type ImageMapController = Controller<Exclude<CrudActions, 'refs'>>;

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
    const images = await ImageMap.paginate<ImageMapListEntry>({
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

    if (!file) throw new ValidationError('baseImage', 'File not found.');

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

  return {
    browse,
    store,
    read,
    edit,
    update,
    destroy,
  };
};
