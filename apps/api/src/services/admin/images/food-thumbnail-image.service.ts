import { IoC } from '@intake24/api/ioc';
import type { SourceFileInput } from '@intake24/common/types/http/admin';
import { FoodThumbnailImage } from '@intake24/db';

function foodThumbnailImageService({
  processedImageService,
  sourceImageService,
}: Pick<IoC, 'processedImageService' | 'sourceImageService'>) {
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

  return {
    createImage,
  };
}

export default foodThumbnailImageService;

export type FoodThumbnailImageService = ReturnType<typeof foodThumbnailImageService>;
