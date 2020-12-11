require('dotenv').config();

import {
    AsServedImage,
    AsServedSet,
    Food,
    FoodLocal,
    GuideImage,
    GuideImageObject,
    ImageMap,
    ImageMapObject,
    NutrientMapping,
    NutrientTableRecord,
    NutrientTableRecordNutrient,
    PortionSizeMethod,
    PortionSizeMethodParameter,
    ProcessedImage
} from '@api-server/db/models/foods';

import DB from '@api-server/db';

import databaseConfig from '@api-server/config/database'

import logger from '@api-server/services/logger'

const batchSize = 500;
const portionSizeKcal = 240;
const locale = 'en_GB';
const energyKcalNutrientType = 1;


class AsServedHelper {
    private sets?: AsServedSet[];

    async init() {
        this.sets = await AsServedSet.findAll({
            include: [{
                model: AsServedImage,
                include: [{ model: ProcessedImage, as: 'image' }]
            }]
        })
    }

    private getSetById(id: string): AsServedSet | undefined {
        if (this.sets) {
            for (let set of this.sets) {
                if (set.id === id)
                    return set;
            }
        }
        return undefined;
    }

    findClosestPortionSize(asServedSetId: string, weight: number): { actualWeight: number, imagePath: string } | undefined {
        const set = this.getSetById(asServedSetId);

        if (set && set.asServedImages && set.asServedImages.length > 0) {
            let best = 0;

            for (let i = 1; i < set.asServedImages.length; ++i) {
                if (Math.abs(weight - set.asServedImages[i].weight) < Math.abs(weight - set.asServedImages[best].weight))
                    best = i;
            }

            const image = set.asServedImages[best].image;

            if (image) {
                return {
                    actualWeight: set.asServedImages[best].weight,
                    imagePath: image.path
                }
            }
        }

        return undefined;
    }
}

class GuideImageHelper {

    private guideImages?: GuideImage[];

    async init() {
        this.guideImages = await GuideImage.findAll({
            include: [
                {
                    model: ImageMap,
                    include: [{ model: ImageMapObject, include: [ProcessedImage] }, ProcessedImage]
                },
                GuideImageObject]
        });
    }

    getImageById(id: string): GuideImage | undefined {
        if (this.guideImages) {
            return this.guideImages.find(gi => gi.id === id)
        }
        return undefined;
    }

    findClosestPortionSize(guideImageId: string, weight: number): { actualWeight: number, guideImagePath: string, objectId: number, overlayImagePath: string } | undefined {

        const guideImage = this.getImageById(guideImageId);

        if (guideImage && guideImage.objects && guideImage.objects.length > 0 && guideImage.imageMap && guideImage.imageMap.objects) {
            let best = 0;

            for (let i = 1; i < guideImage.objects.length; ++i) {
                if (Math.abs(weight - guideImage.objects[i].weight) < Math.abs(weight - guideImage.objects[best].weight))
                    best = i;
            }

            const guideImageObject = guideImage.objects[best]!;

            const imageMapObject = guideImage.imageMap.objects.find(obj => obj.id = guideImageObject.imageMapObjectId);

            if (imageMapObject && guideImage.imageMap.baseImage && imageMapObject.overlayImage) {
                return {
                    actualWeight: guideImageObject.weight,
                    guideImagePath: guideImage.imageMap.baseImage?.path,
                    objectId: guideImageObject.imageMapObjectId,
                    overlayImagePath: imageMapObject.overlayImage?.path
                }
            }
        }

        return undefined;
    }
}


async function foods() {
    let offset = 0;


    while (true) {
        let currentBatch = await Food.findAll(
            {
                include: [{
                    model: FoodLocal,
                    where: { localeId: locale },
                    include: [{
                        model: PortionSizeMethod,
                        separate: true,
                        include: [PortionSizeMethodParameter],
                        required: false
                    },
                        {
                            model: NutrientMapping,
                            separate: true,
                            include: [{
                                model: NutrientTableRecord,
                                include: [NutrientTableRecordNutrient]
                            }]
                        }]
                }],
                where: {
                    code: 'BGMA'
                },
                order: ['code'],
                limit: batchSize,
                offset: offset
            });

        for (let i = 0; i < currentBatch.length; ++i) {

            let local = currentBatch[i]?.localFoods?.[0];

            if (local) {
                console.log(currentBatch[i].code, local.name);

                let nutrientMapping = local.nutrientMappings?.[0];

                if (nutrientMapping) {
                    console.log('Nutrient mapping: ', nutrientMapping.nutrientTableRecord?.nutrientTableId, nutrientMapping.nutrientTableRecord?.nutrientTableRecordId);
                    let energyKcalRecord = nutrientMapping.nutrientTableRecord?.getNutrientByType(energyKcalNutrientType);

                    if (energyKcalRecord) {
                        console.log(nutrientMapping.nutrientTableRecord?.nutrientTableId, nutrientMapping.nutrientTableRecord?.nutrientTableRecordId);
                        console.log(energyKcalRecord.unitsPer100g + ' calories per 100g');
                    } else {
                        console.log('No kcal??');
                    }
                }

                if (local.portionSizeMethods) {
                    for (let m = 0; m < local.portionSizeMethods.length; ++m) {
                        console.log(local.portionSizeMethods[m].method);

                        let params = local.portionSizeMethods[m].parameters

                        if (params) {
                            for (let p = 0; p < params.length; ++p) {
                                console.log(params[p].name, params[p].value);
                            }
                        }
                    }
                }
            }
        }

        if (currentBatch.length == 0)
            break;

        offset += currentBatch.length;
    }
}

async function main() {
    const db = new DB({ databaseConfig: databaseConfig, logger: logger, environment: 'development' });
    await db.init();

    const asServedHelper = new AsServedHelper();
    await asServedHelper.init();

    const guideImageHelper = new GuideImageHelper();
    await guideImageHelper.init();

    console.log(JSON.stringify(guideImageHelper.findClosestPortionSize('Gwatbottle', 250)));
    console.log(JSON.stringify(asServedHelper.findClosestPortionSize('chicken_sauce', 250)));
}

main().catch(err => {
    throw err
});
