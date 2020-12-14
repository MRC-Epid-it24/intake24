require('dotenv').config();

import { createArrayCsvWriter } from 'csv-writer';

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
    NutrientTableRecordNutrient, NutrientType, NutrientUnit,
    PortionSizeMethod,
    PortionSizeMethodParameter,
    ProcessedImage
} from '@api-server/db/models/foods';

import DB from '@api-server/db';

import databaseConfig from '@api-server/config/database'

import logger from '@api-server/services/logger'

const batchSize = 500;
const portionSizeKcal = 240;
const locale = 'NDNSv1';
const energyKcalNutrientType = 1;
const guideImageWidth = 654;

interface AsServedImageData {
    asServedSetId: string,
    imageWeight: number,
    imagePath: string
}

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

    findClosestPortionSize(asServedSetId: string, weight: number): AsServedImageData | undefined {
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
                    asServedSetId,
                    imageWeight: set.asServedImages[best].weight,
                    imagePath: image.path
                }
            }
        }

        return undefined;
    }
}

interface GuideImageData {
    guideImageId: string,
    imageWeight: number,
    guideImagePath: string,
    objectId: number,
    coordinates: [number, number, number, number],
    overlayImagePath: string
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

    findClosestPortionSize(guideImageId: string, weight: number): GuideImageData | undefined {

        const guideImage = this.getImageById(guideImageId);

        if (guideImage && guideImage.objects && guideImage.objects.length > 0 && guideImage.imageMap && guideImage.imageMap.objects) {
            let best = 0;

            for (let i = 1; i < guideImage.objects.length; ++i) {
                if (Math.abs(weight - guideImage.objects[i].weight) < Math.abs(weight - guideImage.objects[best].weight))
                    best = i;
            }

            const guideImageObject = guideImage.objects[best]!;

            console.log('best guide image object:');
            console.log(JSON.stringify(guideImageObject));


            const imageMapObject = guideImage.imageMap.objects.find(obj => obj.id === guideImageObject.imageMapObjectId);

            console.log('image map object:');
            console.log(JSON.stringify(imageMapObject));


            if (imageMapObject && guideImage.imageMap.baseImage && imageMapObject.overlayImage) {
                return {
                    guideImageId,
                    imageWeight: guideImageObject.weight,
                    guideImagePath: guideImage.imageMap.baseImage?.path,
                    objectId: guideImageObject.imageMapObjectId,
                    overlayImagePath: imageMapObject.overlayImage?.path,
                    coordinates: calculateGuideObjectRect(imageMapObject.outlineCoordinates, guideImageWidth)
                }
            }
        }

        return undefined;
    }
}

interface ImageDataWithNutrients<T> {
    imageData: T;
    adjustedWeight: number,
    nutrients: (number | undefined)[];
}

interface PortionSizeImages {
    food: {
        code: string,
        name: string
    },
    composition: {
        fct: string,
        recordId: string,
        recordName: string
    }
    asServedImages: ImageDataWithNutrients<AsServedImageData>[],
    guideImages: ImageDataWithNutrients<GuideImageData>[]
}

async function getNutrientLabels(ids: number[]): Promise<Map<number, string>> {

    const nutrientLabels = new Map<number, string>();

    const records = await NutrientType.findAll(
        {
            include: [NutrientUnit],
            where: {
                id: ids
            }
        }
    );

    for (let id of ids) {
        let record = records.find(r => r.id === id);

        if (!record) {
            throw new Error(`Nutrient type ${id} is not in the database`);
        }

        nutrientLabels.set(id, `${record.description}, ${record.unit?.symbol}`);
    }

    return nutrientLabels;
}

function calculateGuideObjectRect(coordinates: number[], width: number): [number, number, number, number] {
    let maxX = coordinates[0];
    let maxY = coordinates[1];
    let minX = coordinates[0];
    let minY = coordinates[1];

    for (let i = 2; i < coordinates.length; i += 2) {
        minX = Math.min(coordinates[i], minX);
        maxX = Math.max(coordinates[i], maxX);
        minY = Math.min(coordinates[i + 1], minY);
        maxY = Math.max(coordinates[i + 1], maxY);
    }

    return [Math.round(minX * width),
        Math.round(minY * width),
        Math.round(maxX * width),
        Math.round(maxY * width)];
}

function calculateNutrients(weight: number, nutrientIds: number[], databaseRecord: NutrientTableRecord): (number | undefined)[] {
    return nutrientIds.map(id => {
        const nutrientData = databaseRecord.nutrients?.find(n => n.nutrientTypeId === id);
        if (nutrientData) {
            return nutrientData.unitsPer100g / 100.0 * weight;
        } else {
            console.log(`Nutrient data missing for nutrient ${id} in ${databaseRecord.nutrientTableId}, record id ${databaseRecord.nutrientTableRecordId}`);
            return undefined;
        }
    });
}

async function findPortionSizeImages(kcalValue: number, nutrientIds: number[], foodCodes?: string[]): Promise<PortionSizeImages[]> {

    const asServedHelper = new AsServedHelper();
    await asServedHelper.init();

    const guideHelper = new GuideImageHelper();
    await guideHelper.init();

    const portionSizeImages: PortionSizeImages[] = [];

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
                where: foodCodes ? {
                    code: foodCodes
                } : undefined,
                order: ['code'],
                limit: batchSize,
                offset: offset
            });

        for (let i = 0; i < currentBatch.length; ++i) {

            let local = currentBatch[i]?.localFoods?.[0];

            if (local) {
                console.log(currentBatch[i].code, local.name);

                let nutrientMapping = local.nutrientMappings?.[0];

                if (!nutrientMapping) {
                    console.log(`Nutrient mapping is undefined for food ${currentBatch[i].code}, skipping`);
                    continue;
                }

                if (!local.portionSizeMethods) {
                    console.log(`Portion size methods are undefined for food ${currentBatch[i].code}, skipping`);
                    continue;
                }

                let energyKcalRecord = nutrientMapping.nutrientTableRecord?.getNutrientByType(energyKcalNutrientType);

                if (!energyKcalRecord) {
                    console.log(`No energy (kcal) available for food ${currentBatch[i].code}, skipping`);
                    continue;
                }

                console.log(nutrientMapping.nutrientTableRecord?.nutrientTableId, nutrientMapping.nutrientTableRecord?.nutrientTableRecordId);
                console.log(energyKcalRecord.unitsPer100g + ' calories per 100g');

                const asServedImages: ImageDataWithNutrients<AsServedImageData>[] = [];
                const guideImages: ImageDataWithNutrients<GuideImageData>[] = [];

                for (let psm of local.portionSizeMethods) {

                    const targetWeight = kcalValue * 100.0 / energyKcalRecord.unitsPer100g;

                    if (psm.method === 'as-served') {
                        const asServedSetId = psm.parameters?.find(p => p.name === 'serving-image-set')?.value;

                        if (!asServedSetId) {
                            console.log(`Portion size method ${psm.id} for ${local.foodCode} has no "serving-image-set" parameter`);
                            continue;
                        }

                        const asServedImageData = asServedHelper.findClosestPortionSize(asServedSetId, targetWeight / psm.conversionFactor);

                        if (asServedImageData)
                            asServedImages.push({
                                imageData: asServedImageData,
                                adjustedWeight: asServedImageData.imageWeight * psm.conversionFactor,
                                nutrients: calculateNutrients(asServedImageData.imageWeight * psm.conversionFactor, nutrientIds, nutrientMapping.nutrientTableRecord!)
                            });
                    }

                    if (psm.method === 'guide-image') {
                        const guideImageId = psm.parameters?.find(p => p.name === 'guide-image-id')?.value;

                        if (!guideImageId) {
                            console.log(`Portion size method ${psm.id} for ${local.foodCode} has no "guide-image-id" parameter`);
                            continue;
                        }

                        const guideImageData = guideHelper.findClosestPortionSize(guideImageId, targetWeight / psm.conversionFactor);

                        if (guideImageData)
                            guideImages.push({
                                imageData: guideImageData,
                                adjustedWeight: guideImageData.imageWeight * psm.conversionFactor,
                                nutrients: calculateNutrients(guideImageData.imageWeight * psm.conversionFactor, nutrientIds, nutrientMapping.nutrientTableRecord!)
                            });
                    }
                }

                portionSizeImages.push({
                    food: {
                        code: local.foodCode,
                        name: local.name
                    },
                    composition: {
                        fct: nutrientMapping.nutrientTableRecord!.nutrientTableId,
                        recordId: nutrientMapping.nutrientTableRecord!.nutrientTableRecordId,
                        recordName: nutrientMapping.nutrientTableRecord!.name

                    },
                    asServedImages,
                    guideImages
                });
            }
        }

        if (currentBatch.length == 0)
            break;

        offset += currentBatch.length;
    }

    return portionSizeImages;
}

async function main() {
    const db = new DB({ databaseConfig: databaseConfig, logger: logger, environment: 'development' });
    await db.init();

    const nutrientTypeIds = [8, 9, 10, 11, 49, 13, 1, 2, 20, 15, 21, 22, 242, 23, 24, 25, 26,
        28, 29, 27, 30, 243, 244, 245, 246, 247, 248, 249, 250, 50, 55, 56, 57, 58, 59,
        114, 115, 116, 117, 119, 120, 122, 123, 124, 125, 126, 128, 129, 130, 132, 133,
        134, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 151,
        152, 251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265,
        266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280];

    const nutrientLabels = await getNutrientLabels(nutrientTypeIds);

    const portionSizeImages = await findPortionSizeImages(portionSizeKcal, nutrientTypeIds);

    const writer = createArrayCsvWriter({
        path: `portionSizes-${locale}.csv`
    });

    const header = ['Intake24 food code', 'Intake24 food name', 'Portion size method', 'As serving set/guide image ID', 'Weight (image), g', 'Weight (adjusted), g', 'As served image path',
        'Guide image path', 'Guide object id', 'Guide overlay path', 'Guide object area', 'FCT', 'FCT record id', 'FCT food name'];

    for (let nutrientId of nutrientTypeIds)
        header.push(nutrientLabels.get(nutrientId)!);

    await writer.writeRecords([header]);

    for (let psi of portionSizeImages) {

        const rows = [];

        for (let as of psi.asServedImages) {

            const columns = [
                psi.food.code,
                psi.food.name,
                'as-served',
                as.imageData.asServedSetId,
                as.imageData.imageWeight,
                as.adjustedWeight,
                as.imageData.imagePath,
                undefined,
                undefined,
                undefined,
                undefined,
                psi.composition.fct,
                psi.composition.recordId,
                psi.composition.recordName
            ];

            columns.push(...as.nutrients)

            rows.push(columns);
        }

        for (let gi of psi.guideImages) {

            const columns = [
                psi.food.code,
                psi.food.name,
                'guide-image',
                gi.imageData.guideImageId,
                gi.imageData.imageWeight,
                gi.adjustedWeight,
                undefined,
                gi.imageData.guideImagePath,
                gi.imageData.objectId,
                gi.imageData.overlayImagePath,
                `${gi.imageData.coordinates[0]}, ${gi.imageData.coordinates[1]}, ${gi.imageData.coordinates[2]}, ${gi.imageData.coordinates[3]}`,
                psi.composition.fct,
                psi.composition.recordId,
                psi.composition.recordName
            ];

            columns.push(...gi.nutrients)

            rows.push(columns);
        }

        if (rows.length > 0)
            await writer.writeRecords(rows);
    }
}

main().catch(err => {
    throw err
});
