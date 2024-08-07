import type { Request, Response } from 'express';
import { pick } from 'lodash';
import { col, fn } from 'sequelize';

import type { IoC } from '@intake24/api/ioc';
import type { ImageMapEntry, ImageMapsResponse } from '@intake24/common/types/http/admin';
import type { PaginateQuery } from '@intake24/db';
import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { imageResponseCollection } from '@intake24/api/http/responses/admin';
import { ImageMap } from '@intake24/db';

function imageMapController({
  imagesBaseUrl,
  imageMapService,
  portionSizeService,
}: Pick<IoC, 'imagesBaseUrl' | 'imageMapService' | 'portionSizeService'>) {
  const responseCollection = imageResponseCollection(imagesBaseUrl);

  const entry = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>,
  ): Promise<void> => {
    const { imageMapId } = req.params;

    const image = await portionSizeService.getImageMap(imageMapId);
    if (!image)
      throw new NotFoundError();

    res.json(responseCollection.mapEntryResponse(image));
  };

  const browse = async (
    req: Request<any, any, any, PaginateQuery>,
    res: Response<ImageMapsResponse>,
  ): Promise<void> => {
    const images = await ImageMap.paginate({
      query: pick(req.query, ['page', 'limit', 'sort', 'search']),
      columns: ['id', 'description'],
      order: [[fn('lower', col('ImageMap.id')), 'ASC']],
      include: ['baseImage'],
      transform: responseCollection.mapListResponse,
    });

    res.json(images);
  };

  const store = async (req: Request, res: Response<ImageMapEntry>): Promise<void> => {
    const {
      file,
      body: { id, description, objects },
    } = req;
    const { userId } = req.scope.cradle.user;

    if (!file)
      throw new ValidationError('File not found.', { path: 'baseImage' });

    let imageMap = await imageMapService.create({
      id,
      description,
      objects: objects === undefined ? [] : JSON.parse(objects),
      baseImage: file,
      uploader: userId,
    });

    imageMap = await portionSizeService.getImageMap(imageMap.id);

    res.status(201).json(responseCollection.mapEntryResponse(imageMap));
  };

  const read = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>,
  ): Promise<void> => entry(req, res);

  const edit = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>,
  ): Promise<void> => entry(req, res);

  const update = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>,
  ): Promise<void> => {
    const { imageMapId } = req.params;
    const { description, objects } = req.body;

    const image = await imageMapService.update(imageMapId, { description, objects });

    res.json(responseCollection.mapEntryResponse(image));
  };

  const updateImage = async (
    req: Request<{ imageMapId: string }>,
    res: Response<ImageMapEntry>,
  ): Promise<void> => {
    const { file } = req;
    const { imageMapId } = req.params;
    const { userId } = req.scope.cradle.user;

    if (!file)
      throw new ValidationError('File not found.', { path: 'baseImage' });

    await imageMapService.updateImage(imageMapId, file, userId);

    const imageMap = await portionSizeService.getImageMap(imageMapId);

    res.status(200).json(responseCollection.mapEntryResponse(imageMap));
  };

  const destroy = async (
    req: Request<{ imageMapId: string }>,
    res: Response<undefined>,
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
    updateImage,
    destroy,
    refs,
  };
}

export default imageMapController;

export type ImageMapController = ReturnType<typeof imageMapController>;
