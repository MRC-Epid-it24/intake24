import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import multer from 'multer';
import { col, fn, Op } from 'sequelize';

import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { imageResponseCollection } from '@intake24/api/http/responses/admin';
import { unique } from '@intake24/api/http/rules';
import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';
import { imageMulterFile } from '@intake24/common/types/http/admin';
import { ImageMap } from '@intake24/db';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { imageMapId, req }: { imageMapId?: string; req: TsRestRequest<T> }) {
  const where: WhereOptions = imageMapId ? { id: { [Op.ne]: imageMapId } } : {};

  if (!(await unique({ model: ImageMap, condition: { field: 'id', value }, options: { where } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'id' }), {
      code: '$unique',
      path: 'id',
    });
  }
}

export function imageMap() {
  const upload = multer({ dest: ioc.cradle.fsConfig.local.uploads });
  const responseCollection = imageResponseCollection(ioc.cradle.imagesBaseUrl);

  return initServer().router(contract.admin.images.imageMap, {
    browse: {
      middleware: [permission('image-maps', 'image-maps|browse')],
      handler: async ({ query }) => {
        const images = await ImageMap.paginate({
          query,
          columns: ['id', 'description'],
          order: [[fn('lower', col('ImageMap.id')), 'ASC']],
          include: ['baseImage'],
          transform: responseCollection.mapListResponse,
        });

        return { status: 200, body: images };
      },
    },
    store: {
      middleware: [
        permission('image-maps', 'image-maps|create'),
        upload.single('baseImage'),
      ],
      handler: async ({ body, file, req }) => {
        await uniqueMiddleware(body.id, { req });

        const res = imageMulterFile.safeParse(file);
        if (!res.success) {
          throw new ValidationError(
            customTypeValidationMessage('file._', { req, path: 'baseImage' }),
            { path: 'baseImage' },
          );
        }

        const { userId } = req.scope.cradle.user;

        let imageMap = await req.scope.cradle.imageMapService.create({
          ...body,
          baseImage: res.data,
          uploader: userId,
        });

        imageMap = await req.scope.cradle.portionSizeService.getImageMap(imageMap.id);

        return { status: 201, body: responseCollection.mapEntryResponse(imageMap) };
      },
    },
    read: {
      middleware: [permission('image-maps', 'image-maps|read')],
      handler: async ({ params: { imageMapId }, req }) => {
        const image = await req.scope.cradle.portionSizeService.getImageMap(imageMapId);
        if (!image)
          throw new NotFoundError();

        return { status: 200, body: responseCollection.mapEntryResponse(image) };
      },
    },
    update: {
      middleware: [permission('image-maps', 'image-maps|edit')],
      handler: async ({ body, params: { imageMapId }, req }) => {
        const image = await req.scope.cradle.imageMapService.update(imageMapId, body);

        return { status: 200, body: responseCollection.mapEntryResponse(image) };
      },
    },
    updateImage: {
      middleware: [
        permission('image-maps', 'image-maps|edit'),
        upload.single('baseImage'),
      ],
      handler: async ({ file, params: { imageMapId }, req }) => {
        const { userId } = req.scope.cradle.user;

        const res = imageMulterFile.safeParse(file);
        if (!res.success) {
          throw new ValidationError(
            customTypeValidationMessage('file._', { req, path: 'baseImage' }),
            { path: 'baseImage' },
          );
        }

        await req.scope.cradle.imageMapService.updateImage(imageMapId, res.data, userId);
        const imageMap = await req.scope.cradle.portionSizeService.getImageMap(imageMapId);

        return { status: 200, body: responseCollection.mapEntryResponse(imageMap) };
      },
    },
    destroy: {
      middleware: [permission('image-maps', 'image-maps|delete')],
      handler: async ({ params: { imageMapId }, req }) => {
        await req.scope.cradle.imageMapService.destroy(imageMapId);

        return { status: 204, body: undefined };
      },
    },
  });
}
