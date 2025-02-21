import type { AppRoute, AppRouter } from '@ts-rest/core';
import type { TsRestRequest } from '@ts-rest/express';
import type { WhereOptions } from 'sequelize';
import { initServer } from '@ts-rest/express';
import { col, fn, Op } from 'sequelize';

import { NotFoundError, ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import { customTypeValidationMessage } from '@intake24/api/http/requests/util';
import { imageResponseCollection } from '@intake24/api/http/responses/admin';
import { unique } from '@intake24/api/http/rules';
import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';
import { GuideImage, ImageMap } from '@intake24/db';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { guideImageId, req }: { guideImageId?: string; req: TsRestRequest<T> }) {
  const where: WhereOptions = guideImageId ? { id: { [Op.ne]: guideImageId } } : {};

  if (!(await unique({ model: GuideImage, condition: { field: 'id', value }, options: { where } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'id' }), {
      code: '$unique',
      path: 'id',
    });
  }
}

async function dataCheck<T extends AppRoute | AppRouter>(imageMapId: string, req: TsRestRequest<T>) {
  const imageMap = await ImageMap.findByPk(imageMapId, { attributes: ['id'] });

  if (!imageMap) {
    throw new ValidationError(customTypeValidationMessage('exists._', { req, path: 'imageMapId' }), {
      path: 'imageMapId',
    });
  }
}

export function guideImage() {
  const responseCollection = imageResponseCollection(ioc.cradle.imagesBaseUrl);

  return initServer().router(contract.admin.images.guideImage, {
    browse: {
      middleware: [permission('guide-images', 'guide-images:browse')],
      handler: async ({ query }) => {
        const guideImages = await GuideImage.paginate({
          query,
          columns: ['id', 'description'],
          order: [[fn('lower', col('GuideImage.id')), 'ASC']],
          include: ['selectionImage'],
          transform: responseCollection.guideListResponse,
        });

        return { status: 200, body: guideImages };
      },
    },
    store: {
      middleware: [permission('guide-images', 'guide-images:create')],
      handler: async ({ body, req }) => {
        await uniqueMiddleware(body.id, { req });
        await dataCheck(body.imageMapId, req);

        await req.scope.cradle.guideImageService.create(body);

        const guideImage = await req.scope.cradle.portionSizeService.getGuideImage(body.id);
        if (!guideImage)
          throw new NotFoundError();

        return { status: 201, body: responseCollection.guideEntryResponse(guideImage) };
      },
    },
    read: {
      middleware: [permission('guide-images', 'guide-images:read')],
      handler: async ({ params: { guideImageId }, req }) => {
        const guideImage = await req.scope.cradle.portionSizeService.getGuideImage(guideImageId);
        if (!guideImage)
          throw new NotFoundError();

        return { status: 200, body: responseCollection.guideEntryResponse(guideImage) };
      },
    },
    update: {
      middleware: [permission('guide-images', 'guide-images:edit')],
      handler: async ({ body, params: { guideImageId }, req }) => {
        const guideImage = await req.scope.cradle.guideImageService.update(guideImageId, body);

        return { status: 200, body: responseCollection.guideEntryResponse(guideImage) };
      },
    },
    destroy: {
      middleware: [permission('guide-images', 'guide-images:delete')],
      handler: async ({ params: { guideImageId }, req }) => {
        await req.scope.cradle.guideImageService.destroy(guideImageId);

        return { status: 204, body: undefined };
      },
    },
  });
}
