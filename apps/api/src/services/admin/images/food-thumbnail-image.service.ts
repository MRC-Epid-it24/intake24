import { IoC } from '@intake24/api/ioc';
import { Dictionary } from '@intake24/common/types';
import type { SourceFileInput } from '@intake24/common/types/http/admin';
import { FoodThumbnailImage } from '@intake24/db';

function foodThumbnailImageService({
  processedImageService,
  sourceImageService,
  kyselyDb,
}: Pick<IoC, 'processedImageService' | 'sourceImageService' | 'kyselyDb'>) {
  const createImage = async (uploaderId: string, foodLocalId: string, sourceImageInput: SourceFileInput): Promise<FoodThumbnailImage> => {
    const sourceImage = await sourceImageService.uploadSourceImage({ file: sourceImageInput, uploader: uploaderId, id: foodLocalId }, 'food_thumbnail');
    const thumbnailImage = await processedImageService.createFoodThumbnailImage(foodLocalId, sourceImage);

    // According to https://sequelize.org/docs/v6/other-topics/upgrade/
    // created is always null in Postgres
    const [instance, _] = await FoodThumbnailImage.upsert({
      foodLocalId,
      imageId: thumbnailImage.id,
    });

    return instance;
  };

  const resolveImages = async (localeId: string, foodCodes: string[]): Promise<Dictionary<string>> => {
    if (foodCodes.length === 0)
      return {};

    const rows = await kyselyDb.foods
      .selectFrom('foodLocals')
      .innerJoin('foodThumbnailImages', 'foodLocals.id', 'foodThumbnailImages.foodLocalId')
      .innerJoin('processedImages', 'foodThumbnailImages.imageId', 'processedImages.id')
      .select(['foodLocals.foodCode as foodCode', 'processedImages.path as path'])
      .where('foodLocals.localeId', '=', localeId)
      .where('foodLocals.foodCode', 'in', foodCodes)
      .execute();

    return Object.fromEntries(rows.map(row => [row.foodCode, row.path]));
  };

  return {
    createImage,
    resolveImages,
  };
}

export default foodThumbnailImageService;

export type FoodThumbnailImageService = ReturnType<typeof foodThumbnailImageService>;
