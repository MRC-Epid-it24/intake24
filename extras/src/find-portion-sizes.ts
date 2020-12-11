require('dotenv').config();

import {
    Food,
    FoodLocal,
    NutrientMapping,
    NutrientTableRecord,
    PortionSizeMethodParameter
} from '@api-server/db/models/foods';

import DB from '@api-server/db';

import databaseConfig from '@api-server/config/database'

import logger from '@api-server/services/logger'
import PortionSizeMethod from '@api-server/db/models/foods/portion-size-method';
import NutrientTableRecordNutrient from '../../api-server/src/db/models/foods/nutrient-table-record-nutrient';


const batchSize = 500;
const locale = 'en_GB';
const energyKcalNutrientType = 1;

async function main() {

    const db = new DB({ databaseConfig: databaseConfig, logger: logger, environment: 'development' });

    await db.init();

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

main().catch(err => {
    throw err
});
