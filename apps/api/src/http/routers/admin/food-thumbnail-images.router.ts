import { initServer } from '@ts-rest/express';
import multer from 'multer';
import { ValidationError } from '@intake24/api/http/errors';
import { permission } from '@intake24/api/http/middleware';
import ioc from '@intake24/api/ioc';
import { contract } from '@intake24/common/contracts';
import { imageMulterFile } from '@intake24/common/types/http/admin/source-images';
import { FoodLocal } from '@intake24/db';
import { customTypeValidationMessage } from '../../requests/util';

export function foodThumbnailImages() {
  const upload = multer({ dest: ioc.cradle.fsConfig.local.uploads });

  // FIXME: Empty form produces HTTP 500 with 'Unexpected end of form' message
  //        instead of 400
  return initServer().router(contract.admin.foodThumbnailImages, {
    update: {
      middleware: [
        permission('fdbs:edit'),
        upload.single('image'),
      ],
      handler: async ({ file, params: { localeId, foodCode }, req }) => {
        const {
          user,
          foodThumbnailImageService,
        } = req.scope.cradle;

        const res = imageMulterFile.safeParse(file);

        if (!res.success) {
          throw new ValidationError(
            customTypeValidationMessage('file._', { req, path: 'image' }),
            { path: 'image' },
          );
        }

        const foodLocal = await FoodLocal.findOne({ where: { localeId, foodCode } });

        if (foodLocal === null)
          return { status: 404, body: undefined };

        await foodThumbnailImageService.createImage(user.userId, foodLocal.id, res.data);

        return { status: 200, body: undefined };
      },
    },
  });
}
