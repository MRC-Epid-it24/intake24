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
import { AsServedSet } from '@intake24/db';

async function uniqueMiddleware<T extends AppRoute | AppRouter>(value: any, { asServedSetId, req }: { asServedSetId?: string; req: TsRestRequest<T> }) {
  const where: WhereOptions = asServedSetId ? { id: { [Op.ne]: asServedSetId } } : {};

  if (!(await unique({ model: AsServedSet, condition: { field: 'id', value }, options: { where } }))) {
    throw new ValidationError(customTypeValidationMessage('unique._', { req, path: 'id' }), {
      code: '$unique',
      path: 'id',
    });
  }
}

export function asServedSet() {
  const upload = multer({ dest: ioc.cradle.fsConfig.local.uploads });
  const responseCollection = imageResponseCollection(ioc.cradle.imagesBaseUrl);

  return initServer().router(contract.admin.images.asServedSet, {
    browse: {
      middleware: [permission('as-served-sets', 'as-served-sets:browse')],
      handler: async ({ query }) => {
        const asServedSets = await AsServedSet.paginate({
          query,
          columns: ['id', 'description'],
          order: [[fn('lower', col('AsServedSet.id')), 'ASC']],
          include: ['selectionImage'],
          transform: responseCollection.asServedSetListResponse,
        });

        return { status: 200, body: asServedSets };
      },
    },
    store: {
      middleware: [
        permission('as-served-sets', 'as-served-sets:create'),
        upload.single('selectionImage'),
      ],
      handler: async ({ body, file, req }) => {
        await uniqueMiddleware(body.id, { req });

        const { userId } = req.scope.cradle.user;

        const res = imageMulterFile.safeParse(file);
        if (!res.success) {
          throw new ValidationError(
            customTypeValidationMessage('file._', { req, path: 'selectionImage' }),
            { path: 'selectionImage' },
          );
        }

        let asServedSet = await req.scope.cradle.asServedService.createSet({ ...body, file: res.data, uploader: userId });
        asServedSet = await req.scope.cradle.portionSizeService.getAsServedSet(asServedSet.id);

        return { status: 201, body: responseCollection.asServedSetEntryResponse(asServedSet) };
      },
    },
    read: {
      middleware: [permission('as-served-sets', 'as-served-sets:read')],
      handler: async ({ params: { asServedSetId }, req }) => {
        const asServedSet = await req.scope.cradle.portionSizeService.getAsServedSet(asServedSetId);
        if (!asServedSet)
          throw new NotFoundError();

        return { status: 200, body: responseCollection.asServedSetEntryResponse(asServedSet) };
      },
    },
    update: {
      middleware: [permission('as-served-sets', 'as-served-sets:edit')],
      handler: async ({ body, params: { asServedSetId }, req }) => {
        const asServedSet = await req.scope.cradle.asServedService.updateSet(asServedSetId, body);

        return { status: 200, body: responseCollection.asServedSetEntryResponse(asServedSet) };
      },
    },
    destroy: {
      middleware: [permission('as-served-sets', 'as-served-sets:delete')],
      handler: async ({ params: { asServedSetId }, req }) => {
        await req.scope.cradle.asServedService.destroySet(asServedSetId);

        return { status: 204, body: undefined };
      },
    },
  });
}
