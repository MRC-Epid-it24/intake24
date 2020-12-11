import { config } from 'dotenv';

config();

import { Food, FoodLocal, PortionSizeMethodParameter } from '@api-server/db/models/foods';

import DB from '@api-server/db';

import databaseConfig from '@api-server/config/database'

import logger from '@api-server/services/logger'
import PortionSizeMethod from '@api-server/db/models/foods/portion-size-method';


const batchSize = 500
const locale = 'en_GB'

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
                    required: false,
                    include: [{
                        model: PortionSizeMethod,
                        include: [PortionSizeMethodParameter],
                        required: false
                    }]
                }],
                order: ['code'],
                limit: batchSize,
                offset: offset
            });

        for (let i = 0; i < currentBatch.length; ++i) {

            let local = currentBatch[i]?.localFoods?.[0];

            if (local) {
                console.log(currentBatch[i].code, local.name);
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
