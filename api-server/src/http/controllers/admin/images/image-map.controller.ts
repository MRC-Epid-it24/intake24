import { Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';
import * as uuid from 'uuid';
import { NotFoundError } from '@/http/errors';
import { ImageMapListEntry, ImageMapResponse, ImageMapsResponse } from '@common/types/http/admin';
import type { IoC } from '@/ioc';
import { GuideImage, ImageMap, ProcessedImage, SourceImage } from '@/db/models/foods';
import { User } from '@/db/models/system';
import imagesResponseCollection from '@/http/responses/admin/images';
import { Controller, CrudActions } from '../../controller';

export type ImageMapController = Controller<CrudActions>;

export default ({
  config,
  portionSizeService,
}: Pick<IoC, 'config' | 'portionSizeService'>): ImageMapController => {
  const responseCollection = imagesResponseCollection(config.app.urls.images);

  const entry = async (req: Request, res: Response<ImageMapResponse>): Promise<void> => {
    const { mapId } = req.params;

    const image = await portionSizeService.getImageMap(mapId);

    if (!image) throw new NotFoundError();

    const data = responseCollection.mapEntryResponse(image);

    res.json({ data, refs: {} });
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

  // TODO: create / update / delete

  const create = async (req: Request, res: Response): Promise<void> => {
    res.json({ refs: {} });
  };

  const store = async (req: Request, res: Response): Promise<void> => {
    const {
      file,
      body: { id, description },
    } = req;
    const user = req.user as User;

    console.log(file);

    const filename = `${uuid.v4()}${path.extname(file.originalname)}`;

    const destDir = path.join('source', 'image_maps', id);
    const thumbDestDir = path.join('source', 'thumbnails', 'image_maps', id);
    const liveDir = path.join('image_maps', id);

    const destPath = path.join(destDir, filename);
    const thumbDestPath = path.join(thumbDestDir, filename);
    const livePath = path.join(liveDir, filename);

    for (const dir of [destDir, thumbDestDir, liveDir]) {
      await fs.ensureDir(path.join(config.filesystem.local.images, dir));
    }

    await fs.copy(file.path, path.join(config.filesystem.local.images, destPath));
    await fs.copy(file.path, path.join(config.filesystem.local.images, thumbDestPath));

    const sourceImage = await SourceImage.create({
      path: destPath,
      uploader: user.id,
      uploadedAt: new Date(),
      thumbnailPath: thumbDestPath,
    });

    console.log(sourceImage.id);

    // This should go to job to process the source image
    /* const processedImage = await ProcessedImage.create({
      path: livePath,
      sourceId: sourceImage.id,
      purpose: 1,
    }); */

    // const image = await GuideImage.create();

    // res.status(201).json({ data: image });
    res.status(201).json();
  };

  const detail = async (req: Request, res: Response<ImageMapResponse>): Promise<void> =>
    entry(req, res);

  const edit = async (req: Request, res: Response<ImageMapResponse>): Promise<void> =>
    entry(req, res);

  const update = async (req: Request, res: Response<ImageMapResponse>): Promise<void> => {
    const { mapId } = req.params;

    const image = await GuideImage.findByPk(mapId);

    if (!image) throw new NotFoundError();

    // await image.update();

    const data = responseCollection.guideEntryResponse(image);

    res.json({ data, refs: {} });
  };

  const destroy = async (req: Request, res: Response<undefined>): Promise<void> => {
    const { mapId } = req.params;

    const image = await GuideImage.findByPk(mapId);

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
